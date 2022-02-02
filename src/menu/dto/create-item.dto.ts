import { IsNotEmpty } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  item: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  type: string;
}
