import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @GrpcMethod('NotificationService', 'CreateNotification')
  async createNotification(data: any): Promise<any> {
    return this.notificationsService.createNotification(data);
  }

  @GrpcMethod('NotificationService', 'UpdateNotification')
  async updateNotification(data: any): Promise<any> {
    return this.notificationsService.updateNotification(data);
  }

  @GrpcMethod('NotificationService', 'GetNotification')
  async getNotification(data: any): Promise<any> {
    return this.notificationsService.getNotification(data);
  }
}
