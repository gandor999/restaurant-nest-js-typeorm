import { Role } from '../../roles/role.enum';

export class ReqUserDto {
  username: string;
  userId: string;
  roles: Role;
}
