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
  async listReservations(): Promise<ReservationType[]> {
    return await this.reservationService.listReservations();
  }

  @Query(() => ReservationType, { nullable: true })
  async reservation(@Args('id') id: string): Promise<ReservationType> {
    return await this.reservationService.reservation(id);
  }

  @Mutation(() => ReservationType)
  async createReservation(
    @Args('input') input: createReservationInput,
  ): Promise<ReservationType> {
    return await this.reservationService.createReservation(input);
  }

  @Mutation(() => ReservationType)
  async updateReservation(
    @Args('id') id: string,
    @Args('input') input: createReservationInput,
  ): Promise<ReservationType> {
    return await this.reservationService.updateReservation(id, input);
  }

  @Mutation(() => ReservationType)
  async deleteReservation(@Args('id') id: string): Promise<boolean> {
    return await this.reservationService.deleteReservation(id);
  }
}
