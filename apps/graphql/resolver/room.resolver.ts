import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'entities/room.entity';
import { Repository } from 'typeorm';
import { createRoomInput, RoomType } from 'types/room.type';

@Resolver(() => RoomType)
export class RoomResolver {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly RoomRepo: Repository<RoomEntity>,
  ) {}

  @Query(() => [RoomType])
  async listRooms(): Promise<RoomType[]> {
    return this.RoomRepo.find({
      relations: ['reservations', 'reservations.room'],
    });
  }

  @Query(() => RoomType, { nullable: true })
  async room(@Args('id') id: string): Promise<RoomType> {
    return this.RoomRepo.findOneOrFail({ where: { id } });
  }

  @Mutation(() => RoomType)
  async createRoom(@Args('input') input: createRoomInput): Promise<RoomType> {
    const newRoom = this.RoomRepo.create(input);
    const Room = await this.RoomRepo.save(newRoom);
    return this.RoomRepo.findOneOrFail({ where: { id: Room.id } });
  }

  @Mutation(() => RoomType)
  async updateRoom(
    @Args('id') id: string,
    @Args('input') input: createRoomInput,
  ): Promise<RoomType> {
    await this.RoomRepo.update({ id }, input);
    return this.RoomRepo.findOneOrFail({ where: { id } });
  }

  @Mutation(() => RoomType)
  async deleteRoom(@Args('id') id: string): Promise<boolean> {
    const Room = await this.RoomRepo.findOneOrFail({ where: { id } });
    if (!Room) {
      return false;
    }
    await this.RoomRepo.delete({ id });
    return true;
  }
}
