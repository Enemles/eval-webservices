import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { ExportController } from './export/export.controller';
import { ExportService } from './export/export.service';
import {
  NotifEntity,
  ReservationEntity,
  RoomEntity,
  UserEntity,
} from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'pguser',
      password: 'pgpass',
      database: 'pgdb',
      entities: [RoomEntity, NotifEntity, ReservationEntity, UserEntity],
      synchronize: true,
    }),
    RoomsModule,
    ReservationsModule,
    UsersModule,
    TypeOrmModule.forFeature([NotifEntity]),
  ],
  controllers: [NotificationsController, ExportController],
  providers: [NotificationsService, ExportService],
})
export class AppModule {}
