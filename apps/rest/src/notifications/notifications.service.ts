import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) { }

  async createNotification(data: { reservationId: number; message: string; notificationDate: string }): Promise<Notification> {
    const notification = this.notificationRepository.create({
      reservationId: data.reservationId,
      message: data.message,
      notificationDate: new Date(data.notificationDate),
      isSent: false,
    });
    return await this.notificationRepository.save(notification);
  }

  async updateNotification(data: { id: number; message: string; notificationDate: string }): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id: data.id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.message = data.message;
    notification.notificationDate = new Date(data.notificationDate);
    return await this.notificationRepository.save(notification);
  }

  async getNotification(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }
}
