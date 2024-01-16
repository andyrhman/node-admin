import { Request, Response } from "express";
import { IUser } from "../models/user.models";

export const PermissionMiddleware = (access: string) => {
    return (req: Request, res: Response, next: Function) => {
        const user: IUser = req['user'];

        // Check if the role and permissions are populated
        if (!user.role || !user.role.permissions) {
            return res.status(403).send({ message: 'Unauthorized' });
        }

        const permissions = user.role.permissions;

        if (req.method === 'GET') {
            if (!permissions.some(p => (p.name === `view_${access}`) || (p.name === `edit_${access}`))) {
                return res.status(403).send({
                    message: 'Unauthorized'
                })
            }
        } else {
            if (!permissions.some(p => p.name === `edit_${access}`)) {
                return res.status(403).send({
                    message: 'Unauthorized'
                })
            }
        }

        next();
    }
}