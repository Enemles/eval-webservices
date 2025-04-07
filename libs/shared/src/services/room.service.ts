import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { RoomEntity } from '../entities/room.entity';
import { RoomType, createRoomInput } from '../types/room.type';

export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly RoomRepo: Repository<RoomEntity>,
  ) {}

  async listRooms(): Promise<RoomType[]> {
    return this.RoomRepo.find({
      relations: ['reservations', 'reservations.room'],
    });
  }
  async room(id: string): Promise<RoomType> {
    return this.RoomRepo.findOneOrFail({ where: { id } });
  }

  async createRoom(input: createRoomInput): Promise<RoomType> {
    const newRoom = this.RoomRepo.create(input);
    const Room = await this.RoomRepo.save(newRoom);
    return this.RoomRepo.findOneOrFail({ where: { id: Room.id } });
  }

  async updateRoom(id: string, input: createRoomInput): Promise<RoomType> {
    await this.RoomRepo.update({ id }, input);
    return this.RoomRepo.findOneOrFail({ where: { id } });
  }

  async deleteRoom(id: string): Promise<boolean> {
    const Room = await this.RoomRepo.findOneOrFail({ where: { id } });
    if (!Room) {
      return false;
    }
    await this.RoomRepo.delete({ id });
    return true;
  }
}
