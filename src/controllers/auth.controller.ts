import { Request, Response } from 'express';
import { UserService } from '../services/auth.service';
import { RegisterValidation } from '../validation/register.validation';
import * as argon2 from 'argon2';

export const Register = async (req: Request, res: Response) => {
    const body = req.body;
    const { error } = RegisterValidation.validate(body);
    if (error) {
        return res.status(400).send(error.details); // Send error as JSON string
    }

    const userService = new UserService();

    const emailExists = await userService.findByEmail(body.email.toLowerCase());
    const usernameExists = await userService.findByUsername(body.username.toLowerCase());
    if (emailExists || usernameExists) {
        return res.status(409).send({
            message: 'Email or username already exists'
        });
    }
    const userToCreate = {
        fullName: body.fullname,
        username: body.username.toLowerCase(),
        email: body.email.toLowerCase(),
        password: await argon2.hash(body.password)
    };

    const { password, ...user } = await userService.create(userToCreate);

    res.send(user);
};
