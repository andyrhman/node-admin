import { AbstractService } from "../common/abstract.service";
import { myPrisma } from "../config/db.config";

export class OrderService extends AbstractService<any> {
    constructor() {
        super(myPrisma, myPrisma.order);
    }
}
