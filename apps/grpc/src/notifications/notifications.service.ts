import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotifEntity } from '@app/shared';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(NotifEntity)
    private notificationRepository: Repository<NotifEntity>,
  ) {}

  async createNotification(data: any): Promise<NotifEntity> {
    this.logger.log(`Données reçues pour la création: ${JSON.stringify(data)}`);
    
    // Adapter les données au format attendu par l'entité
    const entityData = {
      reservation_id: data.reservationId || data.reservation_id,
      message: data.message,
      notification_date: data.notificationDate || data.notification_date || new Date().toISOString(),
    };
    
    this.logger.log(`Données adaptées: ${JSON.stringify(entityData)}`);
    
    const notification = this.notificationRepository.create({
      reservation_id: entityData.reservation_id,
      message: entityData.message,
      notification_date: new Date(entityData.notification_date),
      is_sent: false,
    });
    return await this.notificationRepository.save(notification);
  }

  async updateNotification(data: any): Promise<NotifEntity> {
    this.logger.log(`Données reçues pour la mise à jour: ${JSON.stringify(data)}`);
    
    // Adapter les données au format attendu par l'entité
    const id = data.id;
    const entityData = {
      message: data.message,
      notification_date: data.notificationDate || data.notification_date || new Date().toISOString(),
    };
    
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.message = entityData.message;
    notification.notification_date = new Date(entityData.notification_date);
    return await this.notificationRepository.save(notification);
  }

  async getNotification(data: any): Promise<NotifEntity> {
    this.logger.log(`Données reçues pour la récupération: ${JSON.stringify(data)}`);
    
    const id = data.id;
    
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }
}
