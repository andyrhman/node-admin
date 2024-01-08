import { AbstractService } from "../common/abstract.service";
import { User } from "../entity/user.entity";
import { myDataSource } from "../index";

export class UserService extends AbstractService<User> {
    constructor() {
        super(myDataSource.getRepository(User));
    }
    // Find a user by their username or email
    async findByUsernameOrEmail(username: string, email: string): Promise<any | null> {
        return this.repository.findOne({
            where: [{ username }, { email }],
        });
    }
}
