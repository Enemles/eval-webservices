import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { NotifEntity } from '@app/shared';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @GrpcMethod('NotificationService', 'CreateNotification')
  async createNotification(data: {
    reservationId: string;
    message: string;
    notificationDate: string;
  }): Promise<NotifEntity> {
    const entityData = {
      reservation_id: data.reservationId,
      message: data.message,
      notification_date: data.notificationDate
    };
    return await this.notificationsService.createNotification(entityData);
  }

  @GrpcMethod('NotificationService', 'UpdateNotification')
  async updateNotification(data: {
    id: string;
    message: string;
    notificationDate: string;
  }): Promise<NotifEntity> {
    const entityData = {
      id: data.id,
      message: data.message,
      notification_date: data.notificationDate
    };
    return await this.notificationsService.updateNotification(entityData);
  }

  @GrpcMethod('NotificationService', 'GetNotification')
  async getNotification(data: { id: string }): Promise<NotifEntity> {
    return await this.notificationsService.getNotification(data.id);
  }
}
