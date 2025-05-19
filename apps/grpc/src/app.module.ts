import {
  NotifEntity,
  ReservationEntity,
  RoomEntity,
  SharedMinioModule,
  UserEntity,
} from '@app/shared';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportModule } from './export/export.module';
import { ExtractsModule } from './extracts/extracts.module';
import { NotificationsModule } from './notifications/notifications.module';

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
      synchronize: false,
    }),
    NotificationsModule,
    ExportModule,
    ExtractsModule,
    SharedMinioModule,
  ],
})
export class AppModule {}
