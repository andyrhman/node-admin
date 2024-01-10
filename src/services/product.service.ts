import { AbstractService } from "../common/abstract.service";
import { Product } from "../entity/product.entity";
import { myDataSource } from "../index";

export class ProductService extends AbstractService<Product> {
    constructor() {
        super(myDataSource.getRepository(Product));
    }
}
