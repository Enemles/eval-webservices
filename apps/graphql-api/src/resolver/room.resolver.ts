import { RoomService } from '@app/shared/services/room.service';
import { createRoomInput, RoomType } from '@app/shared/types/room.type';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => RoomType)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Query(() => [RoomType])
  async listRooms(): Promise<RoomType[]> {
    return await this.roomService.listRooms();
  }

  @Query(() => RoomType, { nullable: true })
  async room(@Args('id') id: string): Promise<RoomType> {
    return await this.roomService.room(id);
  }

  @Mutation(() => RoomType)
  async createRoom(@Args('input') input: createRoomInput): Promise<RoomType> {
    return await this.roomService.createRoom(input);
  }

  @Mutation(() => RoomType)
  async updateRoom(
    @Args('id') id: string,
    @Args('input') input: createRoomInput,
  ): Promise<RoomType> {
    return await this.roomService.updateRoom(id, input);
  }

  @Mutation(() => RoomType)
  async deleteRoom(@Args('id') id: string): Promise<boolean> {
    return await this.roomService.deleteRoom(id);
  }
}
