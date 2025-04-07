import { Repository } from 'typeorm';
import { ReservationEntity } from '../entities/reservation.entity';
import {
    createReservationInput,
    ReservationType,
} from '../types/reservation.type';

export class ReservationService {
  constructor(
    private readonly ReservationRepo: Repository<ReservationEntity>,
  ) {}

  async listReservations(): Promise<ReservationType[]> {
    return this.ReservationRepo.find({
      relations: ['notifications', 'notifications.reservation'],
    });
  }

  async reservation(id: string): Promise<ReservationType> {
    return this.ReservationRepo.findOneOrFail({ where: { id } });
  }

  async createReservation(
    input: createReservationInput,
  ): Promise<ReservationType> {
    const newReservation = this.ReservationRepo.create(input);
    const Reservation = await this.ReservationRepo.save(newReservation);
    return this.ReservationRepo.findOneOrFail({
      where: { id: Reservation.id },
      relations: ['notifications', 'notifications.reservation'],
    });
  }

  async updateReservation(
    id: string,
    input: createReservationInput,
  ): Promise<ReservationType> {
    await this.ReservationRepo.update({ id }, input);
    return this.ReservationRepo.findOneOrFail({ where: { id } });
  }

  async deleteReservation(id: string): Promise<boolean> {
    const Reservation = await this.ReservationRepo.findOneOrFail({
      where: { id },
    });
    if (!Reservation) {
      return false;
    }
    await this.ReservationRepo.delete({ id });
    return true;
  }
}
