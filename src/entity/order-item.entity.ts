import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar" })
    product_title: string;

    @Column({ type: "int" })
    price: number;

    @Column({ type: "int" })
    quantity: number;

    @ManyToOne(() => Order, order => order.order_item, { lazy: true })
    @JoinColumn({ name: "order_id" })
    order: Promise<Order>;
}
