const { Role, Permission } = require('../../models');
const { isInteger } = require('../utility/parameters.utility.js');
const { UpdateRoleDTO } = require('../validation/dto/update-role.dto');
const { formatValidationErrors } = require('../utility/validation.utility.js');

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 */
const Roles = async (req, res) => {
    const repository = myDataSource.getRepository(Role);

    res.send(await repository.find());
}

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleDTO'
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Role already exists
 */
const CreateRole = async (req, res) => {
    const { name, permissions } = req.body;
    const input = new UpdateRoleDTO(req.body);
    try {
        input.validate();
    } catch (error) {
        return res.status(400).json(formatValidationErrors(error.message));
    }

    // Find the permissions based on the provided ids
    const permissionRecords = await Permission.findAll({
        where: {
            id: permissions // assuming permissions is an array of ids
        }
    });

    // Validate if all provided permissions exist
    const missingPermissions = permissions.filter((id) =>
        !permissionRecords.some(permission => permission.id === id)
    );

    if (missingPermissions.length > 0) {
        return res.status(400).json({
            message: 'Some permissions do not exist',
            missingPermissions
        });
    }

    const role = await Role.create({
        name: name
    });

    // Associate the permissions with the role
    await role.setPermissions(permissionRecords);

    const roleWithPermissions = await Role.findOne({
        where: { id: role.id },
        include: [{
            model: Permission,
            through: { attributes: [] }, // Hide join table attributes
        }]
    });

    res.status(201).json(roleWithPermissions);
}

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the role to retrieve
 *     responses:
 *       200:
 *         description: Role data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 */
const GetRole = async (req, res) => {
    // ? https://www.phind.com/search?cache=mu5hj3pjn11evlg5d1us2la2
    const id = parseInt(req.params.id, 10);

    res.send(await Role.findOne({ where: { id }, include: [{ model: Permission, through: { attributes: [] } }] }));
}

// ? https://www.phind.com/search?cache=aww4upilaldpb6wgjnpww7lu
/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update an existing role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the role to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleDTO'
 *     responses:
 *       202:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Validation error with the input data
 *       404:
 *         description: Role not found
 */
const UpdateRole = async (req, res) => {
    const { name, permissions } = req.body;
    const input = new UpdateRoleDTO(req.body);
    try {
        input.validate();
    } catch (error) {
        return res.status(400).json(formatValidationErrors(error.message));
    }

    const role = await Role.findByPk(parseInt(req.params.id))

    await role.update({ name });

    const findPerm = await Permission.findAll({ where: { id: permissions } });

    await role.setPermissions(findPerm);

    const roleWithPermissions = await Role.findOne({
        where: { id: role.id },
        include: [{
            model: Permission,
            through: { attributes: [] }
        }]
    });

    res.status(201).json(roleWithPermissions);
}

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete an existing role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the role to delete
 *     responses:
 *       204:
 *         description: Role deleted successfully
 *       400:
 *         description: Invalid request due to incorrect path parameter
 *       404:
 *         description: Role not found
 */
const DeleteRole = async (req, res) => {
    if (!isInteger(req.params.id)) {
        return res.status(400).send({ message: "Invalid Request" });
    }

    await Role.destroy({ where: { id: req.params.id } });

    res.status(204).send(null);
}

module.exports = { Roles, CreateRole, GetRole, UpdateRole, DeleteRole }