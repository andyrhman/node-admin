

import { Request, Response } from 'express';
import { UserService } from '../services/auth.service';
import { RegisterValidation } from '../validation/register.validation';
import * as argon2 from 'argon2';
import { User } from '../entity/user.entity';
import { sign } from 'jsonwebtoken';

require('dotenv').config();
// ? https://www.phind.com/agent?cache=clr3id9pk0002l907s609rc5r&source=sidebar
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
    const { password, ...user } = await userService.create({
        fullName: body.fullname,
        username: body.username.toLowerCase(),
        email: body.email.toLowerCase(),
        password: await argon2.hash(body.password)
    });

    res.send(user);
};

// ? Fixing "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client"
// ? https://www.phind.com/search?cache=ju5e3pn4l73xw2j0v7stzoc4
export const Login = async (req: Request, res: Response) => {
    const body = req.body;

    const userService = new UserService();
    let user: User;

    // Check whether to find the user by email or username based on input.
    if (body.email) {
        user = await userService.findByEmail(body.email.toLowerCase());
    } else {
        user = await userService.findByUsername(body.username.toLowerCase());
    }

    if (!user) {
        return res.status(404).send({
            message: "Invalid credentials!"
        });
    }

    if (!await argon2.verify(user.password, body.password)) {
        return res.status(400).send({
            message: "Invalid credentials!"
        });
    }

    const rememberMe = body.rememberMe; // Assuming rememberMe is sent as a boolean in the body
    const maxAge = rememberMe ? 365 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1 year or 1 day

    const payload = { id: user.id };
    const token = sign(payload, 'secret', { expiresIn: '1d' }); // Update 'secret' with your actual secret key

    res.cookie('user_session', token, {
        httpOnly: true,
        maxAge: maxAge // Set the maxAge based on rememberMe
    });

    return res.send({
        message: "Successfully Logged In!"
    });
};

