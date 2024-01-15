import { plainToClass } from 'class-transformer';
import { Role } from '../models/role.models';
import mongoose from 'mongoose';
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
    res.send(await Role.find());
}

/**
//  * @swagger
//  * /api/roles:
//  *   post:
//  *     summary: Create a new role
//  *     tags: [Roles]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/UpdateRoleDTO'
//  *     responses:
//  *       201:
//  *         description: Role created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Role'
//  *       400:
//  *         description: Validation error
//  *       409:
//  *         description: Role already exists
//  */
export const CreateRole = async (req: Request, res: Response) => {
    const { name, permissions } = req.body;
    const input = plainToClass(UpdateRoleDTO, req.body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    const role = await Role.create({
        name,
        permissions: permissions.map((_id: any) => {
            return {
                _id: _id
            }
        })
    });

    res.status(201).send(role);
}

/**
//  * @swagger
//  * /api/roles/{id}:
//  *   get:
//  *     summary: Get a role by ID
//  *     tags: [Roles]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Numeric ID of the role to retrieve
//  *     responses:
//  *       200:
//  *         description: Role data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Role'
//  *       404:
//  *         description: Role not found
//  */
// export const GetRole = async (req: Request, res: Response) => {
//     const repository = myDataSource.getRepository(Role);
//     // ? https://www.phind.com/search?cache=mu5hj3pjn11evlg5d1us2la2
//     const id = parseInt(req.params.id, 10);

//     res.send(await repository.findOne({ where: { id }, relations: ['permissions'] }));
// }

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

    const updatedRole = await Role.findOneAndUpdate(
        { _id: req.params.id }, // Use the role ID from the request parameters
        {
            name: name,
            permissions: permissions.map((_id: any) => {
                return {
                    _id: _id
                }
            })
        },
        { new: true, overwrite: true } // Return the updated document and overwrite it
    );

    if (!updatedRole) {
        return res.status(404).json({ message: 'Role not found' });
    }

    res.status(202).send(updatedRole);
}

/**
//  * @swagger
//  * /api/roles/{id}:
//  *   delete:
//  *     summary: Delete an existing role
//  *     tags: [Roles]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Numeric ID of the role to delete
//  *     responses:
//  *       204:
//  *         description: Role deleted successfully
//  *       400:
//  *         description: Invalid request due to incorrect path parameter
//  *       404:
//  *         description: Role not found
//  */
// export const DeleteRole = async (req: Request, res: Response) => {
//     if (!isInteger(req.params.id)) {
//         return res.status(400).send({ message: "Invalid Request" });
//     }

//     const repository = myDataSource.getRepository(Role);

//     await repository.delete(req.params.id);

//     res.status(204).send(null);
// }