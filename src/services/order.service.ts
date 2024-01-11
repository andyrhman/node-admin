import { FindManyOptions } from "typeorm";
import { AbstractService } from "../common/abstract.service";
import { Order } from "../entity/order.entity";
import { myDataSource } from "../index";

export class OrderService extends AbstractService<Order> {
    constructor() {
        super(myDataSource.getRepository(Order));
    }
    async paginate(options: FindManyOptions<Order>, page: number, take: number, relations = []) {
        const [data, total] = await this.repository.findAndCount({
            ...options,
            take,
            skip: (page - 1) * take,
            relations
        });

        return {
            data: data.map((order: Order) => ({
                id: order.id,
                name: order.name,
                email: order.email,
                total: order.total,
                created_at: order.created_at,
                order_item: order.order_item
            })),
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take),
            },
        };
    }
}
