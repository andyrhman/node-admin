import { AbstractService } from "../common/abstract.service";
import { IUser, User } from "../models/user.models";

export class UserService extends AbstractService<IUser> {
    constructor() {
        super(User);
    }
}
