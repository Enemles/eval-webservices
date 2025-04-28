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
    const { reservationId, message, notificationDate } = data;
    return await this.notificationsService.createNotification({
      reservationId,
      message,
      notificationDate,
    });
  }

  @GrpcMethod('NotificationService', 'UpdateNotification')
  async updateNotification(data: {
    id: string;
    message: string;
    notificationDate: string;
  }): Promise<NotifEntity> {
    const { id, message, notificationDate } = data;
    return await this.notificationsService.updateNotification({
      id,
      message,
      notificationDate,
    });
  }

  @GrpcMethod('NotificationService', 'GetNotification')
  async getNotification(data: { id: string }): Promise<NotifEntity> {
    return await this.notificationsService.getNotification(data.id);
  }
}
