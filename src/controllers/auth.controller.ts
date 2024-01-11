import { myDataSource } from './../index';
import { Request, Response } from 'express';
import { UserService } from '../services/auth.service';
import * as argon2 from 'argon2';
import { User } from '../entity/user.entity';
import { sign } from 'jsonwebtoken';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from '../validation/dto/register.dto';
import { formatValidationErrors } from '../utility/validation.utility';
import { UpdateUserDTO } from '../validation/dto/update-user.dto';
import { UpdateInfoDTO } from '../validation/dto/update-info.dto';

// ? https://www.phind.com/agent?cache=clr3id9pk0002l907s609rc5r&source=sidebar
export const Register = async (req: Request, res: Response) => {
    const body = req.body;
    const input = plainToClass(RegisterDto, body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        // Use the utility function to format and return the validation errors
        return res.status(400).json(formatValidationErrors(validationErrors));
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
        if (!body.email) {
            return res.status(404).send({
                message: "Invalid credentials!"
            });
        }
    } else if (body.username) {
        user = await userService.findByUsername(body.username.toLowerCase());
        if (!body.username) {
            return res.status(404).send({
                message: "Invalid credentials!"
            });
        }
    }
    
    if (!user) {
        return res.status(404).send({
            message: "Invalid credentials!"
        });
    }

    if (!body.password) {
        return res.status(400).send({
            message: "Invalid credentials!"
        });
    }else if (!await argon2.verify(user.password, body.password)) {
        return res.status(400).send({
            message: "Invalid credentials!"
        });
    }

    const rememberMe = body.rememberMe; // Assuming rememberMe is sent as a boolean in the body
    const maxAge = rememberMe ? 365 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1 year or 1 day

    const token = sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie('user_session', token, {
        httpOnly: true,
        maxAge: maxAge, // Set the maxAge based on rememberMe
        sameSite: 'strict',
        // secure: process.env.NODE_ENV === 'production' // Set secure if in production
        // domain: 'yourdomain.com', // If cookie was set with specific domain
    });

    return res.send({
        message: "Successfully Logged In!"
    });
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
    const { password, ...user } = req["user"]

    res.send(user);
};

export const Logout = async (req: Request, res: Response) => {
    res.cookie('user_session', '', {
        sameSite: 'strict',
        maxAge: 0,
        // secure: process.env.NODE_ENV === 'production' // Set secure if in production
        // domain: 'yourdomain.com', // If cookie was set with specific domain
    });
    res.send({
        message: "Success"
    })
};

export const UpdateInfo = async (req: Request, res: Response) => {
    const user = req["user"];

    const body = req.body;
    const input = plainToClass(UpdateInfoDTO, body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    const userService = myDataSource.getRepository(User);

    const existingUser = await userService.findOne({ where: { id: user.id } });

    if (req.body.fullname) {
        existingUser.fullName = req.body.fullname;
    }

    if (req.body.email && req.body.email !== existingUser.email) {
        const existingUserByEmail = await userService.findOne({ where: { email: req.body.email } });
        if (existingUserByEmail) {
            return res.status(409).send({ message: "Email already exists" });
        }
        existingUser.email = req.body.email;
    }

    if (req.body.username && req.body.username !== existingUser.username) {
        const existingUserByUsername = await userService.findOne({ where: { username: req.body.username } });
        if (existingUserByUsername) {
            return res.status(409).send({ message: "Username already exists" })
        }
        existingUser.username = req.body.username;
    }

    await userService.update(user.id, existingUser);

    const { password, ...data } = await userService.findOne({ where: { id: user.id } });
    res.send(data);
};

export const UpdatePassword = async (req: Request, res: Response) => {
    const user = req["user"];

    if (req.body.password !== req.body.password_confirm) {
        return res.status(400).send({
            message: "Password do not match"
        });
    }else if (!req.body.password || !req.body.password_confirm) {
        return res.status(400).send({
            message: "Password do not match"
        });
    }

    const repository = myDataSource.getRepository(User);

    await repository.update(user.id, {
        password: await argon2.hash(req.body.password)
    });

    const { password, ...data } = await repository.findOne({ where: { id: user.id } });

    res.send(data);
}

