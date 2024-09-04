import { myPrisma } from "../config/db.config";
import { AbstractService } from "../common/abstract.service";

export class ProductService extends AbstractService<any> {
    constructor() {
        super(myPrisma, myPrisma.product);
    }
}
