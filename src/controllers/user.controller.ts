import { Request, Response } from "express"
import { myDataSource } from "../index"
import { User } from "../entity/user.entity"
import { plainToClass } from "class-transformer";
import { CreateUserDTO } from "../validation/dto/create-user.dto";
import { isUUID, validate } from "class-validator";
import { formatValidationErrors } from "../utility/validation.utility";
import * as argon2 from "argon2"
import { Role } from "../entity/role.entity";
import { UpdateUserDTO } from "../validation/dto/update-user.dto";
import { UserService } from "../services/auth.service";
import sanitizeHtml from "sanitize-html";

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
export const Users = async (req: Request, res: Response) => {
    const repository = new UserService();
    const take = 10;
    const page = parseInt(req.query.page as string || '1');
    let search = req.query.search;

    let result = await repository.paginate({}, page, take);

    // https://www.phind.com/search?cache=za3cyqzb06bugle970v91phl
    if (typeof search === 'string') {
        search = sanitizeHtml(search);
        if (search) {
            const search2 = search.toString().toLowerCase();
            result.data = result.data.filter(
                p => p.username.toLowerCase().indexOf(search2) >= 0 ||
                    p.email.toLowerCase().indexOf(search2) >= 0
            );
    
            // Check if the resulting filtered data array is empty
            if (result.data.length === 0) {
                // Respond with a 404 status code and a message
                return res.status(404).json({ message: `Not found search name '${search}'` });
            }
        }
    }
    const responseData = result.data.map(u => {
        const { password, ...data } = u;
        return data;
    });

    res.send({
        data: responseData,
        meta: result.meta
    });
}

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
export const CreateUser = async (req: Request, res: Response) => {
    const body = req.body;
    const input = plainToClass(CreateUserDTO, body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    const userService = myDataSource.getRepository(User);
    const emailExists = await userService.findOne({ where: { email: body.email.toLowerCase() } });
    const usernameExists = await userService.findOne({ where: { username: body.username.toLowerCase() } });
    if (emailExists || usernameExists) {
        return res.status(409).send({
            message: 'Email or username already exists'
        });
    }

    const roleService = myDataSource.getRepository(Role);
    const checkRole = await roleService.findOne({ where: { id: body.role_id } });
    if (!checkRole) {
        return res.status(409).send({
            message: 'Role not found'
        });
    }

    const hashedPassword = await argon2.hash('123456');

    const { password, ...user } = await userService.save({
        fullName: body.fullname,
        username: body.username.toLowerCase(),
        email: body.email.toLowerCase(),
        password: hashedPassword,
        role: {
            id: body.role_id
        }
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
export const UpdateUser = async (req: Request, res: Response) => {
    const body = req.body;
    const input = plainToClass(UpdateUserDTO, body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }
    const userService = myDataSource.getRepository(User);
    const roleService = myDataSource.getRepository(Role);

    const existingUser = await userService.findOne({ where: { id: req.params.id } });

    if (req.body.fullname) {
        existingUser.fullName = req.body.fullname;
    }

    if (req.body.email && req.body.email !== existingUser.email) {
        const existingUserByEmail = await userService.findOne({ where: { email: req.body.email } });
        if (existingUserByEmail) {
            return res.status(409).send({ message: "Email already exists" });
        }
        existingUser.email = req.body.email;
    }

    if (req.body.username && req.body.username !== existingUser.username) {
        const existingUserByUsername = await userService.findOne({ where: { username: req.body.username } });
        if (existingUserByUsername) {
            return res.status(409).send({ message: "Username already exists" })
        }
        existingUser.username = req.body.username;
    }

    if (req.body.role_id) {
        const role = await roleService.findOne({ where: { id: req.body.role_id } });
        if (!role) {
            return res.status(404).send({message: 'Role not found'});
        }
        existingUser.role = req.body.role_id;
    }

    await userService.update(req.params.id, existingUser);

    const { password, ...data } = await userService.findOne({ where: { id: req.params.id }, relations: ['role']});

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
export const GetUser = async (req: Request, res: Response) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }
    const userService = myDataSource.getRepository(User);

    const { password, ...user } = await userService.findOne({ where: { id: req.params.id }, relations: ['role'] });

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
export const DeleteUser = async (req: Request, res: Response) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }
    const userService = myDataSource.getRepository(User);

    await userService.delete(req.params.id);

    res.status(204).send(null);
}

