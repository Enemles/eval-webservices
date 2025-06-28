import { RoomService } from '@app/shared/services/room.service';
import { createRoomInput, RoomType } from '@app/shared/types/room.type';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => RoomType)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Query(() => [RoomType])
  async listRooms(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<RoomType[]> {
    return await this.roomService.listRooms(skip, limit);
  }

  @Query(() => RoomType, { nullable: true })
  async room(@Args('id') id: string): Promise<RoomType | null> {
    return await this.roomService.room(id);
  }

  @Mutation(() => RoomType)
  async createRoom(
    @Args('name') name: string,
    @Args('capacity', { type: () => Int }) capacity: number,
    @Args('location') location: string,
  ): Promise<RoomType> {
    return await this.roomService.createRoom({ name, capacity, location });
  }

  @Mutation(() => RoomType)
  async updateRoom(
    @Args('id') id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('capacity', { type: () => Int, nullable: true }) capacity?: number,
    @Args('location', { nullable: true }) location?: string,
  ): Promise<RoomType> {
    return await this.roomService.updateRoom(id, { name, capacity, location });
  }

  @Mutation(() => Boolean)
  async deleteRoom(@Args('id') id: string): Promise<boolean> {
    return await this.roomService.deleteRoom(id);
  }
}
