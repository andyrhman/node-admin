import { AbstractService } from "../common/abstract.service";
import { Role } from "../entity/role.entity";
import { myDataSource } from "../index";

export class RoleService extends AbstractService<Role> {
    constructor() {
        super(myDataSource.getRepository(Role));
    }
}
