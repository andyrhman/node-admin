import { Request, Response } from "express";
import { myPrisma } from "../config/db.config";
import jwt from 'jsonwebtoken';

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const mySession = req.cookies['user_session'];

        const { verify } = jwt;
        const payload: any = verify(mySession, process.env.JWT_SECRET);

        if (!payload) {
            return res.status(401).send({
                message: "Unauthenticated"
            });
        };

        req["user"] = await myPrisma.user.findUnique({ where: { id: payload.id }, include: { role: { include: { permissions: true } } } });

        next();
    } catch (error) {
        return res.status(401).send({
            message: "Unauthenticated"
        });
    }
};