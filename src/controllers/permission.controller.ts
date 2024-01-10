import { Permission } from '../entity/permission.entity';
import { myDataSource } from './../index';
import { Request, Response } from "express";

export const Permissions = async (req: Request, res: Response) => {
    const repository = myDataSource.getRepository(Permission);
    res.send(await repository.find());
}