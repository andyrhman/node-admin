import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({type: 'text'})
    description: string;  

    @Column({default: "https://static-00.iconduck.com/assets.00/slightly-smiling-face-emoji-2048x1974-5msgqz9c.png"})
    image: string;

    @Column()
    price: number;

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;
}