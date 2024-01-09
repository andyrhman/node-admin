// user.entity.ts
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "role_id", referencedColumnName: "id" }, // ? From roles table
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" } // ? From permissions table
  })
  permissions: Permission[];
}