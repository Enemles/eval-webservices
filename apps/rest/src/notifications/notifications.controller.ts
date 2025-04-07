import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.entity';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @GrpcMethod('NotificationService', 'CreateNotification')
  async createNotification(data: any): Promise<Notification> {
    const { reservationId, message, notificationDate } = data;
    return await this.notificationsService.createNotification({
      reservationId: reservationId,
      message,
      notificationDate: notificationDate,
    });
  }

  @GrpcMethod('NotificationService', 'UpdateNotification')
  async updateNotification(data: any): Promise<Notification> {
    const { id, message, notificationDate } = data;
    return await this.notificationsService.updateNotification({
      id,
      message,
      notificationDate: notificationDate,
    });
  }

  @GrpcMethod('NotificationService', 'GetNotification')
  async getNotification(data: any): Promise<Notification> {
    return await this.notificationsService.getNotification(data.id);
  }
}
