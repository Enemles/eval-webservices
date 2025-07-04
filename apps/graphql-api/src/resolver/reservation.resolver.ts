import { ReservationService } from '@app/shared/services/reservation.service';
import {
  createReservationInput,
  ReservationType,
} from '@app/shared/types/reservation.type';
import { Args, Int, Mutation, Query, Resolver, ID } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

@Resolver(() => ReservationType)
export class ReservationResolver {
  private readonly logger = new Logger(ReservationResolver.name);

  constructor(private readonly reservationService: ReservationService) {}

  @Query(() => [ReservationType])
  async listReservations(
    @Args('skip', { nullable: true, type: () => Int }) skip?: number,
    @Args('limit', { nullable: true, type: () => Int }) limit?: number,
  ): Promise<ReservationType[]> {
    this.logger.log(`Query listReservations: skip=${skip}, limit=${limit}`);
    try {
      const result = await this.reservationService.listReservations(skip, limit);
      this.logger.log(`listReservations résultat: ${result.length} réservations trouvées`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur listReservations: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Query(() => ReservationType, { nullable: true })
  async reservation(@Args('id', { type: () => ID }) id: string): Promise<ReservationType | null> {
    this.logger.log(`Query reservation: id=${id}`);
    try {
      const result = await this.reservationService.reservation(id);
      this.logger.log(`reservation résultat: ${result ? 'trouvée' : 'non trouvée'}`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur reservation: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Mutation(() => ReservationType)
  async createReservation(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('room_id', { type: () => ID }) room_id: string,
    @Args('start_time') start_time: Date,
    @Args('end_time') end_time: Date,
  ): Promise<ReservationType> {
    this.logger.log(`Mutation createReservation: user_id=${user_id}, room_id=${room_id}, start_time=${start_time}, end_time=${end_time}`);
    try {
      const input: createReservationInput = {
        userId: user_id,
        roomId: room_id,
        startTime: start_time,
        endTime: end_time,
        status: 'pending', // valeur par défaut
      };
      const result = await this.reservationService.createReservation(input);
      this.logger.log(`createReservation résultat: réservation créée avec ID ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur createReservation: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Mutation(() => ReservationType)
  async updateReservation(
    @Args('id', { type: () => ID }) id: string,
    @Args('start_time', { nullable: true }) start_time?: Date,
    @Args('end_time', { nullable: true }) end_time?: Date,
  ): Promise<ReservationType> {
    this.logger.log(`Mutation updateReservation: id=${id}, start_time=${start_time}, end_time=${end_time}`);
    try {
      // Récupérer la réservation existante pour garder les autres champs
      const existingReservation = await this.reservationService.reservation(id);
      
      if (!existingReservation) {
        this.logger.warn(`updateReservation: réservation avec ID ${id} non trouvée`);
        throw new Error(`Reservation with id ${id} not found`);
      }

      const input: createReservationInput = {
        userId: existingReservation.userId,
        roomId: existingReservation.roomId,
        startTime: start_time || existingReservation.startTime,
        endTime: end_time || existingReservation.endTime,
        status: existingReservation.status,
      };
      
      const result = await this.reservationService.updateReservation(id, input);
      this.logger.log(`updateReservation résultat: réservation ${id} mise à jour`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur updateReservation: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async deleteReservation(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    this.logger.log(`Mutation deleteReservation: id=${id}`);
    try {
      const result = await this.reservationService.deleteReservation(id);
      this.logger.log(`deleteReservation résultat: ${result ? 'supprimée' : 'échec'}`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur deleteReservation: ${error.message}`, error.stack);
      throw error;
    }
  }
}
