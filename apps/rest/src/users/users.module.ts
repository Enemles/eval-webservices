import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ReservationEntity, SharedMinioModule, UserEntity } from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ReservationEntity]),
    SharedMinioModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
