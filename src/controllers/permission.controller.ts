import { myPrisma } from "../config/db.config";
import { Request, Response } from "express";

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
export const Permissions = async (req: Request, res: Response) => {
    res.send(await myPrisma.permission.findMany());
};

export const AddRolePermissions = async (req: Request, res: Response) => {
    const { roleId, permissions } = req.body; // `permissions` is an array of permission IDs

    try {
        // Update the role to connect new permissions
        const role = await myPrisma.role.update({
            where: { id: roleId },
            data: {
                permissions: {
                    connect: permissions.map((id: number) => ({ id }))
                }
            },
            include: {
                permissions: true, // Optional: include updated permissions in the response
            }
        });

        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: "Failed to add permissions to the role" });
    }
};

export const RemoveRolePermissions = async (req: Request, res: Response) => {
    const { roleId, permissions } = req.body; // `permissions` is an array of permission IDs

    try {
        // Update the role to disconnect specified permissions
        const role = await myPrisma.role.update({
            where: { id: roleId },
            data: {
                permissions: {
                    disconnect: permissions.map((id: number) => ({ id }))
                }
            },
            include: {
                permissions: true, // Optional: include updated permissions in the response
            }
        });

        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: "Failed to remove permissions from the role" });
    }
};
