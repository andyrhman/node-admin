import { Request, Response } from "express";
import { myDataSource } from "../index";
import { User } from "../entity/user.entity";
import { verify } from "jsonwebtoken";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const jwt = req.cookies['user_session'];

        const payload: any = verify(jwt, process.env.JWT_SECRET);

        if (!payload) {
            return res.status(401).send({
                message: "Unauthenticated"
            });
        };

        const repository = myDataSource.getRepository(User);
        req["user"] = await repository.findOne({ where: { id: payload.id } });

        next();
    } catch (error) {
        return res.status(401).send({
            message: "Unauthenticated"
        });
    }
}