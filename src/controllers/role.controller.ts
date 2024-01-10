import { plainToClass } from 'class-transformer';
import { Role } from '../entity/role.entity';
import { isInteger } from '../validation/utility/parameters.utility';
import { myDataSource } from './../index';
import { Request, Response } from "express";
import { UpdateRoleDTO } from '../validation/dto/update-role.dto';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../validation/utility/validation.utility';

export const Roles = async (req: Request, res: Response) => {
    const repository = myDataSource.getRepository(Role);

    res.send(await repository.find());
}

export const CreateRole = async (req: Request, res: Response) => {
    const { name, permissions } = req.body;
    const input = plainToClass(UpdateRoleDTO, req.body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    const repository = myDataSource.getRepository(Role);

    const role = await repository.save({
        name,
        permissions: permissions.map((id: any) => {
            return {
                id: id
            }
        })  
    });

    res.status(201).send(role);
}

export const GetRole = async (req: Request, res: Response) => {
    const repository = myDataSource.getRepository(Role);
    // ? https://www.phind.com/search?cache=mu5hj3pjn11evlg5d1us2la2
    const id = parseInt(req.params.id, 10);

    res.send(await repository.findOne({ where: { id }, relations: ['permissions'] }));
}

// ? https://www.phind.com/search?cache=aww4upilaldpb6wgjnpww7lu
export const UpdateRole = async (req: Request, res: Response) => {
    const repository = myDataSource.getRepository(Role);

    const { name, permissions } = req.body;
    const input = plainToClass(UpdateRoleDTO, req.body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    const role = await repository.save({
        id: parseInt(req.params.id),
        name,
        permissions: permissions.map((id: any) => {
            return {
                id: id
            }
        })  
    });

    res.status(202).send(role);
}

export const DeleteRole = async (req: Request, res: Response) => {
    if (!isInteger(req.params.id)) {
        return res.status(400).send({ message: "Invalid Request" });
    }

    const repository = myDataSource.getRepository(Role);

    await repository.delete(req.params.id);

    res.status(204).send(null);
}