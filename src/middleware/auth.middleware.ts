import { Request, Response } from "express";
import { myDataSource } from "../index";
import { User } from "../entity/user.entity";
import jwt from 'jsonwebtoken';

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const { verify } = jwt;

        const user_session = req.cookies['user_session'];

        const payload: any = verify(user_session, process.env.JWT_SECRET);

        if (!payload) {
            return res.status(401).send({
                message: "Unauthenticated"
            });
        };

        const repository = myDataSource.getRepository(User);
        req["user"] = await repository.findOne({ where: { id: payload.id }, relations: ['role', 'role.permissions'] });

        next();
    } catch (error) {
        return res.status(401).send({
            message: "Unauthenticated"
        });
    }
};