import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifEntity, ReservationEntity, RoomEntity, UserEntity } from '@app/shared';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { ExportController } from './export/export.controller';
import { ExportService } from './export/export.service';
import { SharedMinioModule } from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5433, // port mappé dans docker-compose
      username: process.env.POSTGRES_USER || 'pguser',
      password: process.env.POSTGRES_PASSWORD || 'pgpass',
      database: process.env.POSTGRES_DB || 'pgdb',
      entities: [NotifEntity, ReservationEntity, UserEntity, RoomEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([NotifEntity]),
    SharedMinioModule, // Module qui fournit l'accès à MinIO
  ],
  controllers: [NotificationsController, ExportController],
  providers: [NotificationsService, ExportService],
})
export class AppModule {}
