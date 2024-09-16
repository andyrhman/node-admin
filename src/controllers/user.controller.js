const { User, Role } = require('../../models');
const { CreateUserDTO } = require('../validation/dto/create-user.dto.js');
const { isUUID } = require('class-validator');
const { formatValidationErrors } = require('../utility/validation.utility.js');
const { UpdateUserDTO } = require('../validation/dto/update-user.dto.js');
const { UserService } = require('../services/user.service.js');
const sanitizeHtml = require('sanitize-html');
const argon2 = require('argon2');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a paginated list of users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for paginated results
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter users by username or email
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     last_page:
 *                       type: integer
 *       404:
 *         description: No users found matching the search criteria
 */
const Users = async (req, res) => {
    const repository = new UserService();
    const take = 10;
    const page = parseInt(req.query.page || '1'); // Handle potential missing page parameter
    let search = req.query.search;

    let result = await repository.paginate(page, take);

    // Sanitize search input if provided (assuming sanitizeHtml is defined elsewhere)
    if (typeof search === 'string') {
        search = sanitizeHtml(search);
        if (search) {
            const searchLower = search.toLowerCase();
            result.data = result.data.filter(
                (user) =>
                    user.username.toLowerCase().indexOf(searchLower) >= 0 ||
                    user.email.toLowerCase().indexOf(searchLower) >= 0
            );

            // Handle empty filtered data array
            if (result.data.length === 0) {
                return res.status(404).json({ message: `Not found search name '${search}'` });
            }
        }
    }

    res.send(result);
};

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error with the input data
 *       409:
 *         description: Email or username already exists
 */
const CreateUser = async (req, res) => {
    const body = req.body;
    const input = new CreateUserDTO(body);
    try {
        input.validate();
    } catch (error) {
        return res.status(400).json(formatValidationErrors(error.message));
    }

    const emailExists = await User.findOne({ where: { email: body.email.toLowerCase() } });
    const usernameExists = await User.findOne({ where: { username: body.username.toLowerCase() } });
    if (emailExists || usernameExists) {
        return res.status(409).send({
            message: 'Email or username already exists'
        });
    }

    const checkRole = await Role.findOne({ where: { id: body.role_id } });
    if (!checkRole) {
        return res.status(409).send({
            message: 'Role not found'
        });
    }

    const hashedPassword = await argon2.hash('123456');

    const user = await User.create({
        fullName: body.fullname,
        username: body.username.toLowerCase(),
        email: body.email.toLowerCase(),
        password: hashedPassword,
        role_id: body.role_id

    });

    res.status(201).send(user);
}

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDTO'
 *     responses:
 *       202:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or Not Allowed - Invalid UUID
 *       404:
 *         description: User or role not found
 *       409:
 *         description: Email or username already exists
 */
const UpdateUser = async (req, res) => {
    const body = req.body;
    const input = new UpdateUserDTO(body);
    try {
        input.validate();
    } catch (error) {
        return res.status(400).json(formatValidationErrors(error.message));
    }

    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }

    const existingUser = await User.findOne({ where: { id: req.params.id } });

    if (req.body.fullname) {
        existingUser.fullName = req.body.fullname;
    }

    if (req.body.email && req.body.email !== existingUser.email) {
        const existingUserByEmail = await User.findOne({ where: { email: req.body.email } });
        if (existingUserByEmail) {
            return res.status(409).send({ message: "Email already exists" });
        }
        existingUser.email = req.body.email;
    }

    if (req.body.username && req.body.username !== existingUser.username) {
        const existingUserByUsername = await User.findOne({ where: { username: req.body.username } });
        if (existingUserByUsername) {
            return res.status(409).send({ message: "Username already exists" })
        }
        existingUser.username = req.body.username;
    }

    if (req.body.role_id) {
        const role = await Role.findOne({ where: { id: req.body.role_id } });
        if (!role) {
            return res.status(404).send({ message: 'Role not found' });
        }
        existingUser.role = req.body.role_id;
    }

    await User.update({
        fullName: existingUser.fullName,
        email: existingUser.email,
        username: existingUser.username,
        role_id: existingUser.role
    }, { where: { id: req.params.id } });

    const data = await User.findOne({ where: { id: req.params.id }, include: { model: Role } });

    res.status(202).send(data);
}

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the user to get
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Not Allowed - Invalid UUID
 *       404:
 *         description: User not found
 */
const GetUser = async (req, res) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }

    const user = await User.findOne({ where: { id: req.params.id }, include: { model: Role } });

    res.send(user);
}

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the user to delete
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Not Allowed - Invalid UUID
 *       404:
 *         description: User not found
 */
const DeleteUser = async (req, res) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }

    await User.destroy({ where: { id: req.params.id } });

    res.status(204).send(null);
}

module.exports = { Users, CreateUser, UpdateUser, GetUser, DeleteUser };

