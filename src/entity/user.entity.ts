import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullName: string;

    @Column({ unique: true })
    username: string

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    created_at: string;

    @BeforeInsert()
    @BeforeUpdate()
    emailToLowerCase() {
      this.email = this.email.toLowerCase();
    }
  
    @BeforeInsert()
    @BeforeUpdate()
    usernameToLowerCase() {
      this.username = this.username.toLowerCase();
    }
}