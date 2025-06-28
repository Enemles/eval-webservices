import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationEntity } from '../entities/reservation.entity';
import {
    createReservationInput,
    ReservationType,
} from '../types/reservation.type';
import { UserType } from '../types/user.type';
import { RoomType } from '../types/room.type';
import { NotifType } from '../types/notif.type';
import { UserEntity } from '../entities/user.entity';
import { RoomEntity } from '../entities/room.entity';
import { NotifEntity } from '../entities/notif.entity';

// Fonction exportée pour être utilisée par d'autres services
export function mapReservationEntityToType(entity: ReservationEntity): ReservationType {
  const type = new ReservationType();
  type.id = entity.id;
  type.userId = entity.user_id;
  type.roomId = entity.room_id;
  type.startTime = entity.start_time;
  type.endTime = entity.end_time;
  type.createdAt = entity.created_at;
  type.status = entity.status;
  
  // Conversion des entités liées
  if (entity.user) {
    type.user = mapUserEntityToType(entity.user);
  }
  
  if (entity.room) {
    type.room = mapRoomEntityToType(entity.room);
  }
  
  if (entity.notifications) {
    type.notifications = entity.notifications.map(notif => mapNotifEntityToType(notif));
  } else {
    type.notifications = [];
  }
  
  return type;
}

// Fonctions utilitaires pour convertir d'autres entités
function mapUserEntityToType(entity: UserEntity): UserType {
  const userType = new UserType();
  userType.id = entity.id;
  userType.keycloakId = entity.keycloak_id;
  userType.email = entity.email;
  userType.createdAt = entity.created_at;
  return userType;
}

function mapRoomEntityToType(entity: RoomEntity): RoomType {
  const roomType = new RoomType();
  roomType.id = entity.id;
  roomType.name = entity.name;
  roomType.capacity = entity.capacity;
  roomType.location = entity.location;
  roomType.createdAt = entity.created_at;
  return roomType;
}

function mapNotifEntityToType(entity: NotifEntity): NotifType {
  const notifType = new NotifType();
  notifType.id = entity.id;
  notifType.reservationId = entity.reservation_id;
  notifType.message = entity.message;
  notifType.notificationDate = entity.notification_date;
  notifType.isSent = entity.is_sent;
  return notifType;
}

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly ReservationRepo: Repository<ReservationEntity>,
    @InjectRepository(NotifEntity)
    private readonly NotifRepo: Repository<NotifEntity>,
  ) {}

  async listReservations(skip?: number, limit?: number): Promise<ReservationType[]> {
    const queryBuilder = this.ReservationRepo.createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.notifications', 'notifications')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.room', 'room')
      .orderBy('reservation.created_at', 'DESC');
    
    if (skip !== undefined) {
      queryBuilder.offset(skip);
    }
    
    if (limit !== undefined) {
      queryBuilder.limit(limit);
    }
    
    const reservations = await queryBuilder.getMany();
    
    return reservations.map(reservation => mapReservationEntityToType(reservation));
  }

  async reservation(id: string): Promise<ReservationType | null> {
    const reservation = await this.ReservationRepo.findOne({
      where: { id },
      relations: ['notifications', 'notifications.reservation', 'user', 'room'],
    });
    
    if (!reservation) {
      return null;
    }
    
    return mapReservationEntityToType(reservation);
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
      status: input.status,
    };
    
    const newReservation = this.ReservationRepo.create(entityData);
    const reservation = await this.ReservationRepo.save(newReservation);
    
    // Créer automatiquement une notification pour la nouvelle réservation
    const notification = this.NotifRepo.create({
      reservation_id: reservation.id,
      message: `Réservation créée pour la salle`,
      notification_date: new Date(),
      is_sent: false,
    });
    await this.NotifRepo.save(notification);
    
    const savedReservation = await this.ReservationRepo.findOneOrFail({
      where: { id: reservation.id },
      relations: ['notifications', 'notifications.reservation', 'user', 'room'],
    });
    
    return mapReservationEntityToType(savedReservation);
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
      status: input.status,
    };
    
    await this.ReservationRepo.update({ id }, entityData);
    const updatedReservation = await this.ReservationRepo.findOneOrFail({ 
      where: { id },
      relations: ['notifications', 'notifications.reservation', 'user', 'room'],
    });
    
    return mapReservationEntityToType(updatedReservation);
  }

  async deleteReservation(id: string): Promise<boolean> {
    const reservation = await this.ReservationRepo.findOneOrFail({
      where: { id },
    });
    if (!reservation) {
      return false;
    }
    
    // Supprimer d'abord les notifications liées
    await this.NotifRepo.delete({ reservation_id: id });
    
    // Puis supprimer la réservation
    await this.ReservationRepo.delete({ id });
    return true;
  }
}
