import { Role } from '../../roles/role.enum';

export class PayloadDto {
  username: string;
  sub: string;
  roles: Role;
}
