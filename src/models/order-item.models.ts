// import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Order } from "./order.entity";

// @Entity('order_items')
// export class OrderItem{
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @Column()
//     product_title: string;

//     @Column()
//     price: number;

//     @Column()
//     quantity: number;

//     @ManyToOne(() => Order, order => order.order_item)
//     @JoinColumn({name: "order_id"})
//     order: Order;
// }