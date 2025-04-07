import { NotifService } from '@app/shared/services/notif.service';
import { createNotifInput, NotifType } from '@app/shared/types/notif.type';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => NotifType)
export class NotifResolver {
  constructor(private readonly notifService: NotifService) {}

  @Query(() => [NotifType])
  async Notifs(): Promise<NotifType[]> {
    return await this.notifService.Notifs();
  }

  @Query(() => NotifType, { nullable: true })
  async Notif(@Args('id') id: string): Promise<NotifType> {
    return await this.notifService.Notif(id);
  }

  @Mutation(() => NotifType)
  async createNotif(
    @Args('input') input: createNotifInput,
  ): Promise<NotifType> {
    return await this.notifService.createNotif(input);
  }

  @Mutation(() => NotifType)
  async updateNotif(
    @Args('id') id: string,
    @Args('input') input: createNotifInput,
  ): Promise<NotifType> {
    return await this.notifService.updateNotif(id, input);
  }

  @Mutation(() => NotifType)
  async deleteNotif(@Args('id') id: string): Promise<NotifType> {
    return await this.notifService.deleteNotif(id);
  }
}
