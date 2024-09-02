import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    email: string;

    @CreateDateColumn()
    created_at: string;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, { lazy: true })
    order_item: Promise<OrderItem[]>;

    async total(): Promise<number> {
        const items = await this.order_item;
        return items.reduce((sum, i) => sum + i.quantity * i.price, 0);
    }
    /*
        ? If the first and last name name is separated
        * get name(): string{
        *     return `${this.first_name} ${this.last_name}`
        * }
    */
}