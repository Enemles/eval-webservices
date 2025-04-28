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
    const reservations = await this.ReservationRepo.find({
      relations: ['notifications', 'notifications.reservation'],
    });
    
    // Convertir snake_case en camelCase pour respecter l'API GraphQL
    return reservations.map(reservation => this.mapToType(reservation));
  }

  async reservation(id: string): Promise<ReservationType> {
    const reservation = await this.ReservationRepo.findOneOrFail({ where: { id } });
    return this.mapToType(reservation);
  }

  async createReservation(
    input: createReservationInput,
  ): Promise<ReservationType> {
    // Convertir de camelCase à snake_case pour l'entité
    const entityData = {
      user_id: input.userId,
      room_id: input.roomId,
      start_time: input.startTime,
      end_time: input.endTime,
      status: input.status
    };
    
    const newReservation = this.ReservationRepo.create(entityData);
    const reservation = await this.ReservationRepo.save(newReservation);
    
    const savedReservation = await this.ReservationRepo.findOneOrFail({
      where: { id: reservation.id },
      relations: ['notifications', 'notifications.reservation'],
    });
    
    return this.mapToType(savedReservation);
  }

  async updateReservation(
    id: string,
    input: createReservationInput,
  ): Promise<ReservationType> {
    // Convertir de camelCase à snake_case pour l'entité
    const entityData = {
      user_id: input.userId,
      room_id: input.roomId,
      start_time: input.startTime,
      end_time: input.endTime,
      status: input.status
    };
    
    await this.ReservationRepo.update({ id }, entityData);
    const updatedReservation = await this.ReservationRepo.findOneOrFail({ 
      where: { id },
      relations: ['notifications', 'notifications.reservation'],
    });
    
    return this.mapToType(updatedReservation);
  }

  async deleteReservation(id: string): Promise<boolean> {
    const reservation = await this.ReservationRepo.findOneOrFail({
      where: { id },
    });
    if (!reservation) {
      return false;
    }
    await this.ReservationRepo.delete({ id });
    return true;
  }
  
  // Méthode utilitaire pour mapper les propriétés entity (snake_case) vers type (camelCase)
  private mapToType(entity: ReservationEntity): ReservationType {
    const type = new ReservationType();
    type.id = entity.id;
    type.userId = entity.user_id;
    type.roomId = entity.room_id;
    type.startTime = entity.start_time;
    type.endTime = entity.end_time;
    type.createdAt = entity.created_at;
    type.status = entity.status;
    type.user = entity.user;
    type.room = entity.room;
    type.notifications = entity.notifications;
    
    return type;
  }
}
