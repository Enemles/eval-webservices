import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from './notifications/notifications.module';
import { ExportModule } from './export/export.module';
import { ExtractsModule } from './extracts/extracts.module';
import {
  NotifEntity,
  ReservationEntity,
  RoomEntity,
  UserEntity,
  SharedMinioModule,
} from '@app/shared';

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
    NotificationsModule,
    ExportModule,
    ExtractsModule,
    SharedMinioModule,
  ],
})
export class AppModule {}
