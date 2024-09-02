import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  fullName: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({type: 'varchar'})
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

  // Role (Many) to User (one) relationship
  // That means One user has many roles
  @ManyToOne(() => Role)
  @JoinColumn({ name: "role_id" })
  role: Role;
}