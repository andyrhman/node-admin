const { Role, Permission } = require('../../models');

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 */
const Permissions = async (req, res) => {
    res.send(await Permission.findAll());
}

const AddRolePermissions = async (req, res) => {
    const { roleId, permissions } = req.body; // `permissions` is an array of permission IDs

    try {
        // Find the role by ID
        const role = await Role.findByPk(roleId);

        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        // Find permissions to add
        const permissionRecords = await Permission.findAll({
            where: {
                id: permissions
            }
        });

        // Add the permissions to the role
        await role.addPermissions(permissionRecords);

        // Fetch the role with updated permissions
        const updatedRole = await Role.findOne({
            where: { id: roleId },
            include: [{
                model: Permission,
                through: { attributes: [] },
            }]
        });

        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add permissions to the role' });
    }
};

const RemoveRolePermissions = async (req, res) => {
    const { roleId, permissions } = req.body; // `permissions` is an array of permission IDs

    try {
        // Find the role by ID
        const role = await Role.findByPk(roleId);

        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        // Find permissions to remove
        const permissionRecords = await Permission.findAll({
            where: {
                id: permissions
            }
        });

        // Remove the permissions from the role
        await role.removePermissions(permissionRecords);

        // Fetch the role with updated permissions
        const updatedRole = await Role.findOne({
            where: { id: roleId },
            include: [{
                model: Permission,
                through: { attributes: [] },
            }]
        });

        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove permissions from the role' });
    }
};

module.exports = { Permissions, AddRolePermissions, RemoveRolePermissions }