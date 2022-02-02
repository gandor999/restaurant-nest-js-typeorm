import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PublicController } from './public.controller';

@Module({
  imports: [UsersModule],
  controllers: [PublicController],
})
export class PublicModule {}
