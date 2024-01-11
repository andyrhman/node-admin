import { Permission } from '../entity/permission.entity';
import { myDataSource } from './../index';
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
    const repository = myDataSource.getRepository(Permission);
    res.send(await repository.find());
}