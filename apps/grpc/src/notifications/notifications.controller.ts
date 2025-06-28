import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @GrpcMethod('NotificationService', 'CreateNotification')
  async createNotification(data: any): Promise<any> {
    const notification =
      await this.notificationsService.createNotification(data);
    // Transformer la réponse au format attendu par le proto
    return {
      id: notification.id,
      reservationId: notification.reservation_id,
      message: notification.message,
      notificationDate: notification.notification_date.toISOString(),
      isSent: notification.is_sent,
    };
  }

  @GrpcMethod('NotificationService', 'UpdateNotification')
  async updateNotification(data: any): Promise<any> {
    const notification =
      await this.notificationsService.updateNotification(data);
    console.log(notification);

    // Transformer la réponse au format attendu par le proto
    return {
      id: notification.id,
      reservationId: notification.reservation_id,
      message: notification.message,
      notificationDate: notification.notification_date.toISOString(),
      isSent: notification.is_sent,
    };
  }

  @GrpcMethod('NotificationService', 'GetNotification')
  async getNotification(data: any): Promise<any> {
    const notification = await this.notificationsService.getNotification(data);

    // Transformer la réponse au format attendu par le proto
    return {
      id: notification.id,
      reservationId: notification.reservation_id,
      message: notification.message,
      notificationDate: notification.notification_date.toISOString(),
      isSent: notification.is_sent,
    };
  }
}
