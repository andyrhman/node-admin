// import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { OrderItem } from "./order-item.entity";

// @Entity('orders')
// export class Order {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @Column()
//     name: string;

//     @Column()
//     email: string;

//     @CreateDateColumn()
//     created_at: string;

//     @OneToMany(() => OrderItem, orderItem => orderItem.order)
//     order_item: OrderItem[];

//     get total(): number {
//         return this.order_item.reduce((sum, i) => sum + i.quantity * i.price, 0);
//     }
//     /*
//         ? If the first and last name name is separated
//         * get name(): string{
//         *     return `${this.first_name} ${this.last_name}`
//         * }
//     */
// }