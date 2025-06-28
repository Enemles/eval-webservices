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
    
    const reservationId = data.reservationId || data.reservation_id;
    
    if (!reservationId) {
      throw new Error('reservationId est requis pour créer une notification');
    }
    
    const entityData = {
      reservation_id: reservationId,
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
    
    const savedNotification = await this.notificationRepository.save(notification);
    this.logger.log(`Notification créée avec ID: ${savedNotification.id}`);
    
    return savedNotification;
  }

  async updateNotification(data: any): Promise<NotifEntity> {
    this.logger.log(`Données reçues pour la mise à jour: ${JSON.stringify(data)}`);
    
    const id = data.id;
    if (!id) {
      throw new Error('id est requis pour mettre à jour une notification');
    }
    
    const entityData = {
      message: data.message,
      notification_date: data.notificationDate || data.notification_date || new Date().toISOString(),
    };
    
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification avec ID ${id} non trouvée`);
    }
    notification.message = entityData.message;
    notification.notification_date = new Date(entityData.notification_date);
    
    const updatedNotification = await this.notificationRepository.save(notification);
    this.logger.log(`Notification mise à jour: ${updatedNotification.id}`);
    
    return updatedNotification;
  }

  async getNotification(data: any): Promise<NotifEntity> {
    this.logger.log(`Données reçues pour la récupération: ${JSON.stringify(data)}`);
    
    const id = data.id;
    if (!id) {
      throw new Error('id est requis pour récupérer une notification');
    }
    
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification avec ID ${id} non trouvée`);
    }
    
    this.logger.log(`Notification trouvée: ${notification.id}`);
    return notification;
  }
}
