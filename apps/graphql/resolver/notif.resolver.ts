import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { NotifEntity } from 'entities/notif.entity';
import { Repository } from 'typeorm';
import { createNotifInput, NotifType } from 'types/notif.type';

@Resolver(() => NotifType)
export class NotifResolver {
  constructor(
    @InjectRepository(NotifEntity)
    private readonly NotifRepo: Repository<NotifEntity>,
  ) {}

  @Query(() => [NotifType])
  async Notifs(): Promise<NotifType[]> {
    return this.NotifRepo.find({
      relations: ['reservation', 'reservation.notifications'],
    });
  }

  @Query(() => NotifType, { nullable: true })
  async Notif(@Args('id') id: string): Promise<NotifType> {
    return this.NotifRepo.findOneOrFail({ where: { id } });
  }

  @Mutation(() => NotifType)
  async createNotif(
    @Args('input') input: createNotifInput,
  ): Promise<NotifType> {
    const newNotif = this.NotifRepo.create(input);
    const Notif = await this.NotifRepo.save(newNotif);
    return this.NotifRepo.findOneOrFail({ where: { id: Notif.id } });
  }

  @Mutation(() => NotifType)
  async updateNotif(
    @Args('id') id: string,
    @Args('input') input: createNotifInput,
  ): Promise<NotifType> {
    await this.NotifRepo.update({ id }, input);
    return this.NotifRepo.findOneOrFail({ where: { id } });
  }

  @Mutation(() => NotifType)
  async deleteNotif(@Args('id') id: string): Promise<NotifType> {
    const Notif = await this.NotifRepo.findOneOrFail({ where: { id } });
    await this.NotifRepo.delete({ id });
    return Notif;
  }
}
