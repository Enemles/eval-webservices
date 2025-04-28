import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotifEntity } from '@app/shared';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotifEntity)
    private notificationRepository: Repository<NotifEntity>,
  ) {}

  async createNotification(data: {
    reservationId: string;
    message: string;
    notificationDate: string;
  }): Promise<NotifEntity> {
    const notification = this.notificationRepository.create({
      reservation_id: data.reservationId,
      message: data.message,
      notification_date: new Date(data.notificationDate),
      is_sent: false,
    });
    return await this.notificationRepository.save(notification);
  }

  async updateNotification(data: {
    id: string;
    message: string;
    notificationDate: string;
  }): Promise<NotifEntity> {
    const notification = await this.notificationRepository.findOne({
      where: { id: data.id },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.message = data.message;
    notification.notification_date = new Date(data.notificationDate);
    return await this.notificationRepository.save(notification);
  }

  async getNotification(id: string): Promise<NotifEntity> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }
}
