import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from '../menu/menu.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderRepository } from './repositories/order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository]), MenuModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
