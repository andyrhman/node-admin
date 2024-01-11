import { Request, Response } from "express"
import { myDataSource } from "../index"
import { User } from "../entity/user.entity"
import { plainToClass } from "class-transformer";
import { RegisterDto } from "../validation/dto/create-user.dto";
import { isUUID, validate } from "class-validator";
import { formatValidationErrors } from "../utility/validation.utility";
import * as argon2 from "argon2"
import { Role } from "../entity/role.entity";
import { UpdateUserDTO } from "../validation/dto/update-user.dto";
import { UserService } from "../services/auth.service";
import sanitizeHtml from "sanitize-html";

export const Users = async (req: Request, res: Response) => {
    const repository = new UserService();
    const take = 10;
    const page = parseInt(req.query.page as string || '1');
    let search = req.query.search;

    let result = await repository.paginate({}, page, take);

    // https://www.phind.com/search?cache=za3cyqzb06bugle970v91phl
    if (typeof search === 'string') {
        search = sanitizeHtml(search);
        if (search) {
            const search2 = search.toString().toLowerCase();
            result.data = result.data.filter(
                p => p.username.toLowerCase().indexOf(search2) >= 0 ||
                    p.email.toLowerCase().indexOf(search2) >= 0
            );
    
            // Check if the resulting filtered data array is empty
            if (result.data.length === 0) {
                // Respond with a 404 status code and a message
                return res.status(404).json({ message: `Not found search name '${search}'` });
            }
        }
    }
    const responseData = result.data.map(u => {
        const { password, ...data } = u;
        return data;
    });

    res.send({
        data: responseData,
        meta: result.meta
    });
}

export const CreateUser = async (req: Request, res: Response) => {
    const body = req.body;
    const input = plainToClass(RegisterDto, body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    const userService = myDataSource.getRepository(User);

    const emailExists = await userService.findOne({ where: { email: body.email.toLowerCase() } });
    const usernameExists = await userService.findOne({ where: { username: body.username.toLowerCase() } });
    if (emailExists || usernameExists) {
        return res.status(409).send({
            message: 'Email or username already exists'
        });
    }

    const hashedPassword = await argon2.hash('123456');

    const { password, ...user } = await userService.save({
        fullName: body.fullname,
        username: body.username.toLowerCase(),
        email: body.email.toLowerCase(),
        password: hashedPassword,
        role_id: {
            id: 2
        }
    });

    res.status(201).send(user);
}

export const UpdateUser = async (req: Request, res: Response) => {
    const body = req.body;
    const input = plainToClass(UpdateUserDTO, body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }
    const userService = myDataSource.getRepository(User);
    const roleService = myDataSource.getRepository(Role);

    const existingUser = await userService.findOne({ where: { id: req.params.id } });

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

    if (req.body.role_id) {
        const role = await roleService.findOne({ where: { id: req.body.role_id } });
        if (!role) {
            return res.status(404).send({message: 'Role not found'});
        }
        existingUser.role = req.body.role_id;
    }

    await userService.update(req.params.id, existingUser);

    const { password, ...data } = await userService.findOne({ where: { id: req.params.id }, relations: ['role']});

    res.status(202).send(data);
}

export const GetUser = async (req: Request, res: Response) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }
    const userService = myDataSource.getRepository(User);

    const { password, ...user } = await userService.findOne({ where: { id: req.params.id }, relations: ['role'] });

    res.send(user);
}

export const DeleteUser = async (req: Request, res: Response) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).send({ message: "Not Allowed" })
    }
    const userService = myDataSource.getRepository(User);

    await userService.delete(req.params.id);

    res.status(204).send(null);
}

