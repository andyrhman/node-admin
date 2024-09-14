const { User } = require('../../models');
const { RegisterDto } = require('../validation/dto/register.dto.js');
const { UserService } = require('../services/user.service.js');
const { formatValidationErrors } = require('../utility/validation.utility.js');
const { UpdateInfoDTO } = require('../validation/dto/update-info.dto.js');
const { sign } = require('jsonwebtoken');

const argon2 = require('argon2');

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
const Register = async (req, res) => {
    const body = req.body;

    const input = new RegisterDto(body);
    try {
        input.validate();
    } catch (error) {
        return res.status(400).json(formatValidationErrors(error.message));
    }

    const userService = new UserService();

    // Check if email or username already exists
    const emailExists = await userService.findByEmail(body.email.toLowerCase());
    const usernameExists = await userService.findByUsername(body.username.toLowerCase());
    if (emailExists || usernameExists) {
        return res.status(409).send({
            message: 'Email or username already exists'
        });
    }

    // Create the new user
    const user = await userService.create({
        fullName: body.fullname,
        username: body.username.toLowerCase(),
        email: body.email.toLowerCase(),
        password: await argon2.hash(body.password),
        role_id: 3
    });

    res.send(user);
};

// ? Fixing "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client"
// ? https://www.phind.com/search?cache=ju5e3pn4l73xw2j0v7stzoc4
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user and return a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               #email:
 *               #  type: string
 *               #  format: email
 *               #  description: Email address of the user, use this or username
 *               username:
 *                 type: string
 *                 description: Username of the user, use this or email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the user account
 *               rememberMe:
 *                 type: boolean
 *                 description: Whether to remember the user for a longer period
 *     responses:
 *       200:
 *         description: Login successful, returns a success message
 *       400:
 *         description: Invalid credentials provided
 *       404:
 *         description: User not found
 */
const Login = async (req, res) => {
    const body = req.body;

    const userService = new UserService();

    let user;

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

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get the authenticated user's data
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthenticated - When the user is not logged in or token is invalid
 */
const AuthenticatedUser = async (req, res) => {
    if (!req["user"]) {
        // Handle the case where user is not set
        return res.status(401).send({ message: "Unauthenticated" });
    }
    const user = req["user"]

    res.send(user);
};

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Logout the user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
const Logout = async (req, res) => {
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
const UpdateInfo = async (req, res) => {
    const user = req["user"];

    const body = req.body;
    const input = new UpdateInfoDTO(body);
    try {
        input.validate();
    } catch (error) {
        return res.status(400).json(formatValidationErrors(error.message));
    }

    const existingUser = await User.findOne({ where: { id: user.id } });

    if (req.body.fullname) {
        existingUser.fullName = req.body.fullname;
    }

    if (req.body.email && req.body.email !== existingUser.email) {
        const existingUserByEmail = await User.findOne({ where: { email: req.body.email } });
        if (existingUserByEmail) {
            return res.status(409).send({ message: "Email already exists" });
        }
        existingUser.email = req.body.email;
    }

    if (req.body.username && req.body.username !== existingUser.username) {
        const existingUserByUsername = await User.findOne({ where: { username: req.body.username } });
        if (existingUserByUsername) {
            return res.status(409).send({ message: "Username already exists" })
        }
        existingUser.username = req.body.username;
    }

    await User.update(
        {
            fullName: existingUser.fullName,
            email: existingUser.email,
            username: existingUser.username,
        },
        { where: { id: user.id } }
    );

    const data = await User.findOne({ where: { id: user.id } });
    res.send(data);
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
const UpdatePassword = async (req, res) => {
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

    await User.update(
        { password: await argon2.hash(req.body.password) },
        { where: { id: user.id } }
    );

    const data = await User.findOne({ where: { id: user.id } });

    res.send(data);
}

module.exports = { Register, Login, AuthenticatedUser, Logout, UpdateInfo, UpdatePassword }