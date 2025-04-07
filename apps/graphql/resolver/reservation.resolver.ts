import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationEntity } from 'entities/reservation.entity';
import { Repository } from 'typeorm';
import {
  createReservationInput,
  ReservationType,
} from 'types/reservation.type';

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly ReservationRepo: Repository<ReservationEntity>,
  ) {}

  @Query(() => [ReservationType])
  async listReservations(): Promise<ReservationType[]> {
    return this.ReservationRepo.find({
      relations: ['notifications', 'notifications.reservation'],
    });
  }

  @Query(() => ReservationType, { nullable: true })
  async reservation(@Args('id') id: string): Promise<ReservationType> {
    return this.ReservationRepo.findOneOrFail({ where: { id } });
  }

  @Mutation(() => ReservationType)
  async createReservation(
    @Args('input') input: createReservationInput,
  ): Promise<ReservationType> {
    const newReservation = this.ReservationRepo.create(input);
    const Reservation = await this.ReservationRepo.save(newReservation);
    return this.ReservationRepo.findOneOrFail({
      where: { id: Reservation.id },
      relations: ['notifications', 'notifications.reservation'],
    });
  }

  @Mutation(() => ReservationType)
  async updateReservation(
    @Args('id') id: string,
    @Args('input') input: createReservationInput,
  ): Promise<ReservationType> {
    await this.ReservationRepo.update({ id }, input);
    return this.ReservationRepo.findOneOrFail({ where: { id } });
  }

  @Mutation(() => ReservationType)
  async deleteReservation(@Args('id') id: string): Promise<boolean> {
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
