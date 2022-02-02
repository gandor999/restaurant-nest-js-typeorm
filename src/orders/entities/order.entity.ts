import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Column({
    name: 'ITEM_NAME',
    length: 255,
    type: 'varchar',
  })
  item: string;

  @Column({
    name: 'ORDER_QUANTITY',
    type: 'int',
  })
  quantity: number;

  @Column({
    name: 'CUSTOMER_ID',
    length: 255,
    type: 'varchar',
  })
  customerId: string;

  @Column({
    default: true,
  })
  isActive: boolean;
}
