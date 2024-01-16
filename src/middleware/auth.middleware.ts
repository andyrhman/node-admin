import { Request, Response } from "express";
import { User } from "../models/user.models";
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

        // Use Mongoose's `populate` to include related documents (role and permissions)
        const user = await User.findById(payload.id).populate({
            path: 'role',
            populate: {
                path: 'permissions'
            }
        });

        if (!user) {
            return res.status(401).send({ message: "Unauthenticated" });
        }

        req['user'] = user;
        next()
    } catch (error) {
        return res.status(401).send({
            message: "Unauthenticated"
        });
    }
}