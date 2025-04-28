import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationEntity } from '@app/shared';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
  ) {}

  async findAll(skip = 0, limit = 10): Promise<ReservationEntity[]> {
    return await this.reservationRepository.find({
      skip,
      take: limit,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
    });
    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }
    return reservation;
  }

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationEntity> {
    const reservation = this.reservationRepository.create({
      user_id: createReservationDto.user_id,
      room_id: createReservationDto.room_id,
      start_time: new Date(createReservationDto.start_time),
      end_time: new Date(createReservationDto.end_time),
      status: 'pending', // Définir un statut par défaut
    });
    return await this.reservationRepository.save(reservation);
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationEntity> {
    const reservation = await this.findOne(id);
    
    // Mise à jour des champs si présents dans le DTO
    if (updateReservationDto.user_id) {
      reservation.user_id = updateReservationDto.user_id;
    }
    
    if (updateReservationDto.room_id) {
      reservation.room_id = updateReservationDto.room_id;
    }
    
    if (updateReservationDto.start_time) {
      reservation.start_time = new Date(updateReservationDto.start_time);
    }
    
    if (updateReservationDto.end_time) {
      reservation.end_time = new Date(updateReservationDto.end_time);
    }
    
    if (updateReservationDto.status) {
      reservation.status = updateReservationDto.status;
    }
    
    return await this.reservationRepository.save(reservation);
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
  }
}
