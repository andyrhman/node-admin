import { plainToClass } from 'class-transformer';
import { isInteger } from '../utility/parameters.utility';
import { myPrisma } from '../config/db.config';
import { Request, Response } from "express";
import { UpdateRoleDTO } from '../validation/dto/update-role.dto';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utility/validation.utility';

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
export const Roles = async (req: Request, res: Response) => {
    res.send(await myPrisma.role.findMany());
};

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
export const CreateRole = async (req: Request, res: Response) => {
    const { name, permissions } = req.body;
    const input = plainToClass(UpdateRoleDTO, req.body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    // Fetch all permissions by their IDs
    const checkPerm = await myPrisma.permission.findMany({
        where: {
            id: {
                in: permissions
            }
        }
    });

    // Validate if all provided permissions exist
    const missingPermissions = permissions.filter((id: number) =>
        !checkPerm.some(permission => permission.id === id)
    );

    if (missingPermissions.length > 0) {
        return res.status(400).json({
            message: 'Some permissions do not exist',
            missingPermissions
        });
    }

    const role = await myPrisma.role.create({
        data: {
            name,
            permissions: {
                connect: permissions.map((id: number) => ({
                    id
                }))
            }
        }
    });

    res.status(201).send(role);
};

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
export const GetRole = async (req: Request, res: Response) => {
    res.send(await myPrisma.role.findUnique({ where: { id: parseInt(req.params.id, 10) }, include: { permissions: true } }));
};

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
export const UpdateRole = async (req: Request, res: Response) => {
    const { name, permissions } = req.body;
    const input = plainToClass(UpdateRoleDTO, req.body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    // Update the role with the new name and associated permissions
    const role = await myPrisma.role.update({
        where: {
            id: parseInt(req.params.id),
        },
        data: {
            name,
            permissions: {
                set: permissions.map((id: number) => ({ id })) // Disconnect all previous permissions and connect the new ones
            }
        },
        include: {
            permissions: true, // Include permissions in the returned role object
        }
    });

    res.status(202).send(role);
};

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
export const DeleteRole = async (req: Request, res: Response) => {
    if (!isInteger(req.params.id)) {
        return res.status(400).send({ message: "Invalid Request" });
    }

    await myPrisma.role.delete({ where: { id: parseInt(req.params.id, 10) } });

    res.status(204).send(null);
};