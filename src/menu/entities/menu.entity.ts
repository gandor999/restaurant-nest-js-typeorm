import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  @Column({
    name: 'ITEM_NAME',
    length: 255,
    type: 'varchar',
    unique: true,
  })
  item: string;

  @Column({
    name: 'ITEM_DESCRIPTION',
    length: 255,
    type: 'varchar',
  })
  description: string;

  @Column({
    name: 'ITEM_TYPE',
    length: 255,
    type: 'varchar',
  })
  type: string;
}
