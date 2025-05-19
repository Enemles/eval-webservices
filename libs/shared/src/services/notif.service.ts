import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotifEntity } from '../entities/notif.entity';
import { createNotifInput, NotifType } from '../types/notif.type';
import { mapReservationEntityToType } from './reservation.service';

export class NotifService {
  constructor(
    @InjectRepository(NotifEntity)
    private readonly NotifRepo: Repository<NotifEntity>,
  ) {}

  async Notifs(): Promise<NotifType[]> {
    const notifications = await this.NotifRepo.find({
      relations: ['reservation', 'reservation.notifications'],
    });
    return notifications.map((notif) => this.mapEntityToType(notif));
  }

  async Notif(id: string): Promise<NotifType> {
    const notification = await this.NotifRepo.findOneOrFail({ where: { id } });
    return this.mapEntityToType(notification);
  }

  async createNotif(input: createNotifInput): Promise<NotifType> {
    const newNotif = this.NotifRepo.create({
      reservation_id: input.reservationId,
      message: input.message,
      notification_date: input.notificationDate,
      is_sent: input.isSent,
    });
    const Notif = await this.NotifRepo.save(newNotif);
    const savedNotif = await this.NotifRepo.findOneOrFail({
      where: { id: Notif.id },
      relations: ['reservation'],
    });
    return this.mapEntityToType(savedNotif);
  }

  async updateNotif(id: string, input: createNotifInput): Promise<NotifType> {
    await this.NotifRepo.update(
      { id },
      {
        reservation_id: input.reservationId,
        message: input.message,
        notification_date: input.notificationDate,
        is_sent: input.isSent,
      },
    );
    const notification = await this.NotifRepo.findOneOrFail({
      where: { id },
      relations: ['reservation'],
    });
    return this.mapEntityToType(notification);
  }

  async deleteNotif(id: string): Promise<NotifType> {
    const notification = await this.NotifRepo.findOneOrFail({ where: { id } });
    await this.NotifRepo.delete({ id });
    return this.mapEntityToType(notification);
  }

  mapEntityToType(entity: NotifEntity): NotifType {
    const notifType = new NotifType();
    notifType.id = entity.id;
    notifType.reservationId = entity.reservation_id;
    notifType.message = entity.message;
    notifType.notificationDate = entity.notification_date;
    notifType.isSent = entity.is_sent;
    
    // Si la relation reservation est chargée, la convertir également
    if (entity.reservation) {
      notifType.reservation = mapReservationEntityToType(entity.reservation);
    }
    
    return notifType;
  }
}
