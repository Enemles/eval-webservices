import { ReservationService } from '@app/shared/services/reservation.service';
import {
  createReservationInput,
  ReservationType,
} from '@app/shared/types/reservation.type';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @Query(() => [ReservationType])
  async listReservations(
    @Args('skip', { nullable: true }) skip?: number,
    @Args('limit', { nullable: true }) limit?: number,
  ): Promise<ReservationType[]> {
    return await this.reservationService.listReservations(skip, limit);
  }

  @Query(() => ReservationType, { nullable: true })
  async reservation(@Args('id') id: string): Promise<ReservationType> {
    return await this.reservationService.reservation(id);
  }

  @Mutation(() => ReservationType)
  async createReservation(
    @Args('user_id') user_id: string,
    @Args('room_id') room_id: string,
    @Args('start_time') start_time: string,
    @Args('end_time') end_time: string,
  ): Promise<ReservationType> {
    const input: createReservationInput = {
      userId: user_id,
      roomId: room_id,
      startTime: new Date(start_time),
      endTime: new Date(end_time),
      status: 'pending', // valeur par défaut
    };
    return await this.reservationService.createReservation(input);
  }

  @Mutation(() => ReservationType)
  async updateReservation(
    @Args('id') id: string,
    @Args('start_time', { nullable: true }) start_time?: string,
    @Args('end_time', { nullable: true }) end_time?: string,
  ): Promise<ReservationType> {
    // Récupérer la réservation existante pour garder les autres champs
    const existingReservation = await this.reservationService.reservation(id);

    const input: createReservationInput = {
      userId: existingReservation.userId,
      roomId: existingReservation.roomId,
      startTime: start_time
        ? new Date(start_time)
        : existingReservation.startTime,
      endTime: end_time ? new Date(end_time) : existingReservation.endTime,
      status: existingReservation.status,
    };
    return await this.reservationService.updateReservation(id, input);
  }

  @Mutation(() => Boolean)
  async deleteReservation(@Args('id') id: string): Promise<boolean> {
    return await this.reservationService.deleteReservation(id);
  }
}
