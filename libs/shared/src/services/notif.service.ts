import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotifEntity } from '../entities/notif.entity';
import { createNotifInput, NotifType } from '../types/notif.type';

export class NotifService {
  constructor(
    @InjectRepository(NotifEntity)
    private readonly NotifRepo: Repository<NotifEntity>,
  ) {}

  async Notifs(): Promise<NotifType[]> {
    return this.NotifRepo.find({
      relations: ['reservation', 'reservation.notifications'],
    });
  }

  async Notif(id: string): Promise<NotifType> {
    return this.NotifRepo.findOneOrFail({ where: { id } });
  }

  async createNotif(input: createNotifInput): Promise<NotifType> {
    const newNotif = this.NotifRepo.create(input);
    const Notif = await this.NotifRepo.save(newNotif);
    return this.NotifRepo.findOneOrFail({ where: { id: Notif.id } });
  }

  async updateNotif(id: string, input: createNotifInput): Promise<NotifType> {
    await this.NotifRepo.update({ id }, input);
    return this.NotifRepo.findOneOrFail({ where: { id } });
  }

  async deleteNotif(id: string): Promise<NotifType> {
    const Notif = await this.NotifRepo.findOneOrFail({ where: { id } });
    await this.NotifRepo.delete({ id });
    return Notif;
  }
}
