import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotifEntity } from '@app/shared';

@Module({
  imports: [TypeOrmModule.forFeature([NotifEntity])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
