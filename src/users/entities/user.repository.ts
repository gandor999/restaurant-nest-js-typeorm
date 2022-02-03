import { Role } from '../../roles/role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({
    name: 'USERNAME',
    length: 255,
    type: 'varchar',
    unique: true,
  })
  username: string;

  @Column({
    name: 'PASSWORD',
    length: 255,
    type: 'varchar',
  })
  password: string;

  @Column({
    name: 'ROLES',
    default: Role.User,
  })
  roles: Role;
}
