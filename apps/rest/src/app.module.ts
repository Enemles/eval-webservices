import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { Notification } from './notifications/notification.entity';
import { ExportController } from './export/export.controller';
import { ExportService } from './export/export.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'pguser',
      password: 'pgpass',
      database: 'pgdb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    RoomsModule,
    ReservationsModule,
    UsersModule,
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [NotificationsController, ExportController],
  providers: [NotificationsService, ExportService],

})
export class AppModule { }