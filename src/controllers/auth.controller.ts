import { Request, Response } from 'express';
import { UserService } from '../services/auth.service';
import * as argon2 from 'argon2';
import { sign } from 'jsonwebtoken';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from '../validation/dto/register.dto';
import { formatValidationErrors } from '../utility/validation.utility';
import { UpdateInfoDTO } from '../validation/dto/update-info.dto';
import { IUser, User } from '../models/user.models';

// ? https://www.phind.com/agent?cache=clr3id9pk0002l907s609rc5r&source=sidebar
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterDto'
 *     responses:
 *       200:
 *         description: Registration successful, returns the user data
 *       400:
 *         description: Validation error with the input data
 *       409:
 *         description: Email or username already exists
 */
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
    const user = await User.create({
        fullName: body.fullname,
        username: body.username.toLowerCase(),
        email: body.email.toLowerCase(),
        password: await argon2.hash(body.password),
        // role: {
        //     id: 3,
        //     name: '',
        //     permissions: []
        // }
    });

    const userData = user.toObject();
    delete userData.password;
    res.send(userData);
};

// ? Fixing "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client"
// ? https://www.phind.com/search?cache=ju5e3pn4l73xw2j0v7stzoc4
// /**
//  * @swagger
//  * /api/login:
//  *   post:
//  *     summary: Login a user and return a JWT token
//  *     tags: [Authentication]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               #email:
//  *               #  type: string
//  *               #  format: email
//  *               #  description: Email address of the user, use this or username
//  *               username:
//  *                 type: string
//  *                 description: Username of the user, use this or email
//  *               password:
//  *                 type: string
//  *                 format: password
//  *                 description: Password for the user account
//  *               rememberMe:
//  *                 type: boolean
//  *                 description: Whether to remember the user for a longer period
//  *     responses:
//  *       200:
//  *         description: Login successful, returns a success message
//  *       400:
//  *         description: Invalid credentials provided
//  *       404:
//  *         description: User not found
//  */
export const Login = async (req: Request, res: Response) => {
    const body = req.body;

    const userService = new UserService();
    let user: IUser;

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
    } else if (!await argon2.verify(user.password, body.password)) {
        return res.status(400).send({
            message: "Invalid credentials!"
        });
    }

    const rememberMe = body.rememberMe; // Assuming rememberMe is sent as a boolean in the body
    const maxAge = rememberMe ? 365 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1 year or 1 day

    const token = sign(
        { id: user._id },
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

/**
//  * @swagger
//  * /api/user:
//  *   get:
//  *     summary: Get the authenticated user's data
//  *     tags: [Authentication]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Authenticated user data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                   type: string
//  *                 username:
//  *                   type: string
//  *                 email:
//  *                   type: string
//  *       401:
//  *         description: Unauthenticated - When the user is not logged in or token is invalid
//  */
export const AuthenticatedUser = async (req: Request, res: Response) => {
    if (!req["user"]) {
        return res.status(401).send({ message: "Unauthenticated" });
    }
    const user = req["user"]

    const userData = user.toObject();
    delete userData.password;
    res.send(userData);
};

/**
//  * @swagger
//  * /api/logout:
//  *   post:
//  *     summary: Logout the user
//  *     tags: [Authentication]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Successfully logged out
//  */
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

/**
 * @swagger
 * /api/user/info:
 *   put:
 *     summary: Update user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInfoDTO'
 *     responses:
 *       200:
 *         description: User information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullname:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Validation error with the input data
 *       409:
 *         description: Email or username already exists
 */
export const UpdateInfo = async (req: Request, res: Response) => {
    const user = req["user"];

    const body = req.body;
    const input = plainToClass(UpdateInfoDTO, body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    const existingUser = await User.findOne({ _id: user.id });

    if (req.body.fullname) {
        existingUser.fullName = req.body.fullname;
    }

    if (req.body.email && req.body.email !== existingUser.email) {
        const existingUserByEmail = await User.findOne({ email: req.body.email });
        if (existingUserByEmail) {
            return res.status(409).send({ message: "Email already exists" });
        }
        existingUser.email = req.body.email;
    }

    if (req.body.username && req.body.username !== existingUser.username) {
        const existingUserByUsername = await User.findOne({ username: req.body.username });
        if (existingUserByUsername) {
            return res.status(409).send({ message: "Username already exists" })
        }
        existingUser.username = req.body.username;
    }

    await User.findByIdAndUpdate(user.id, existingUser);

    const data = await User.findById(user.id);
    const userData = data.toObject();
    delete userData.password;
    res.send(userData);
};

/**
 * @swagger
 * /api/user/password:
 *   put:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password for the user account
 *               password_confirm:
 *                 type: string
 *                 format: password
 *                 description: Confirmation of the new password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Password do not match or missing password
 */
export const UpdatePassword = async (req: Request, res: Response) => {
    const user = req["user"];

    if (req.body.password !== req.body.password_confirm) {
        return res.status(400).send({
            message: "Password do not match"
        });
    } else if (!req.body.password || !req.body.password_confirm) {
        return res.status(400).send({
            message: "Password do not match"
        });
    }

    await User.findByIdAndUpdate(user.id, {
        password: await argon2.hash(req.body.password)
    });

    const data = await User.findById(user.id);

    const userData = data.toObject();
    delete userData.password;
    res.send(userData);
}

