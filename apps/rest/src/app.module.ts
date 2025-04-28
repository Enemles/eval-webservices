import {
  NotifEntity,
  ReservationEntity,
  RoomEntity,
  UserEntity,
} from '@app/shared';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ExportController } from './export/export.controller';
import { ExportService } from './export/export.service';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { ReservationsModule } from './reservations/reservations.module';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';

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
  providers: [
    NotificationsService,
    ExportService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
