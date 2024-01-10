import { AbstractService } from "../common/abstract.service";
import { User } from "../entity/user.entity";
import { myDataSource } from "../index";

export class UserService extends AbstractService<User> {
    constructor() {
        super(myDataSource.getRepository(User));
    }
}
