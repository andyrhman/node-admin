import { AbstractService } from "../common/abstract.service";
import { myPrisma } from "../config/db.config";

export class UserService extends AbstractService<any> {
    constructor() {
        super(myPrisma, myPrisma.user);
    }
}
