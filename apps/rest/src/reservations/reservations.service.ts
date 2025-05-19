import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ReservationEntity,
  UserEntity,
  RoomEntity,
  NotifEntity,
} from '@app/shared';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(NotifEntity)
    private notifRepository: Repository<NotifEntity>,
  ) {}

  async findAll(skip = 0, limit = 10): Promise<ReservationEntity[]> {
    return await this.reservationRepository.find({
      skip,
      take: limit,
      order: { id: 'ASC' },
      relations: ['user', 'room', 'notifications'],
    });
  }

  async findOne(id: string): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['user', 'room', 'notifications'],
    });
    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }
    return reservation;
  }

  private async createNotification(reservationId: string, message: string): Promise<NotifEntity> {
    const notification = this.notifRepository.create({
      reservation_id: reservationId,
      message,
      is_sent: false,
    });
    return await this.notifRepository.save(notification);
  }

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationEntity> {
    // Gérer les deux formats (snake_case ou camelCase)
    const userId = createReservationDto.user_id || createReservationDto.userId || '';
    const roomId = createReservationDto.room_id || createReservationDto.roomId || '';
    const startTime = createReservationDto.start_time || createReservationDto.startTime || '';
    const endTime = createReservationDto.end_time || createReservationDto.endTime || '';
    const status = createReservationDto.status || 'pending';

    if (!userId || !roomId || !startTime || !endTime) {
      throw new Error('Les champs utilisateur, salle, et dates sont obligatoires');
    }

    // Vérifier que l'utilisateur et la salle existent
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException(`Salle avec l'ID ${roomId} non trouvée`);
    }

    const reservation = this.reservationRepository.create({
      user_id: userId,
      room_id: roomId,
      start_time: new Date(startTime),
      end_time: new Date(endTime),
      status,
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    // Créer une notification pour la nouvelle réservation
    await this.createNotification(
      savedReservation.id,
      `Nouvelle réservation créée pour la salle ${room.name} du ${new Date(startTime).toLocaleString()} au ${new Date(endTime).toLocaleString()}`
    );

    // Recharger la réservation avec les relations
    return await this.findOne(savedReservation.id);
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationEntity> {
    const reservation = await this.findOne(id);
    
    // Mise à jour des champs si présents dans le DTO
    if (updateReservationDto.userId || updateReservationDto.user_id) {
      reservation.user_id = (updateReservationDto.user_id || updateReservationDto.userId) as string;
    }
    
    if (updateReservationDto.roomId || updateReservationDto.room_id) {
      reservation.room_id = (updateReservationDto.room_id || updateReservationDto.roomId) as string;
    }
    
    if (updateReservationDto.startTime || updateReservationDto.start_time) {
      const startTime = updateReservationDto.start_time || updateReservationDto.startTime;
      if (startTime) {
        reservation.start_time = new Date(startTime);
      }
    }
    
    if (updateReservationDto.endTime || updateReservationDto.end_time) {
      const endTime = updateReservationDto.end_time || updateReservationDto.endTime;
      if (endTime) {
        reservation.end_time = new Date(endTime);
      }
    }
    
    if (updateReservationDto.status) {
      reservation.status = updateReservationDto.status;
    }
    
    const updatedReservation = await this.reservationRepository.save(reservation);

    // Créer une notification pour la mise à jour de la réservation
    const room = await this.roomRepository.findOne({ where: { id: updatedReservation.room_id } });
    if (room) {
      await this.createNotification(
        updatedReservation.id,
        `Réservation mise à jour pour la salle ${room.name}. Statut: ${updatedReservation.status}`
      );
    } else {
      await this.createNotification(
        updatedReservation.id,
        `Réservation mise à jour. Statut: ${updatedReservation.status}`
      );
    }

    // Recharger la réservation avec les relations
    return await this.findOne(updatedReservation.id);
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
  }
}
