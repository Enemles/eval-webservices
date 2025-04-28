import {
  AuthModule,
  NotifEntity,
  ReservationEntity,
  RoomEntity,
  UserEntity,
} from '@app/shared';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReservationEntity,
      RoomEntity,
      UserEntity,
      NotifEntity,
    ]),
    AuthModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
