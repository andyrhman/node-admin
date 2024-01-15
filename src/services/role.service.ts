import { AbstractService } from "../common/abstract.service";
import { Role, IRole } from "../models/role.models";

export class RoleService extends AbstractService<IRole> {
    constructor() {
        super(Role);
    }
}
