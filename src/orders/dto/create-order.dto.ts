import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  item: string;

  @IsNotEmpty()
  quantity: number;
}
