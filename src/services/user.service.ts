import { AbstractService } from "../common/abstract.service";
import { myPrisma } from "../index";

export class UserService extends AbstractService<any> {
    constructor() {
        super(myPrisma, myPrisma.user);
    }
}
