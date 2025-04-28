import {
  NotifEntity,
  ReservationEntity,
  RoomEntity,
  SharedMinioModule,
  UserEntity,
} from '@app/shared';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
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
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'pguser',
      password: process.env.POSTGRES_PASSWORD || 'pgpass',
      database: process.env.POSTGRES_DB || 'pgdb',
      entities: [RoomEntity, NotifEntity, ReservationEntity, UserEntity],
      synchronize: true,
    }),
    RoomsModule,
    ReservationsModule,
    UsersModule,
    TypeOrmModule.forFeature([NotifEntity, ReservationEntity]),
    AuthModule,
    SharedMinioModule,
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
export class AppModule {}
