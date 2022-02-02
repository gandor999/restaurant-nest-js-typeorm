import { IsNotEmpty } from 'class-validator';

export class UpdateUsernameDto {
  @IsNotEmpty()
  username: string;
}
