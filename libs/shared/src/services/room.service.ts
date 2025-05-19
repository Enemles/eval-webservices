import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../entities/room.entity';
import { RoomType, createRoomInput } from '../types/room.type';
import { ReservationType } from '../types/reservation.type';
import { ReservationEntity } from '../entities/reservation.entity';

export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly RoomRepo: Repository<RoomEntity>,
  ) {}

  async listRooms(skip?: number, limit?: number): Promise<RoomType[]> {
    const options = {
      relations: ['reservations', 'reservations.room'],
    };

    // Ajouter la pagination si spécifiée
    if (skip !== undefined && limit !== undefined) {
      options['skip'] = skip;
      options['take'] = limit;
    }

    const rooms = await this.RoomRepo.find(options);
    return rooms.map((room) => this.mapEntityToType(room));
  }
  
  async room(id: string): Promise<RoomType> {
    const room = await this.RoomRepo.findOneOrFail({
      where: { id },
      relations: ['reservations', 'reservations.room', 'reservations.user'],
    });
    return this.mapEntityToType(room);
  }

  async createRoom(input: createRoomInput): Promise<RoomType> {
    const newRoom = this.RoomRepo.create(input);
    const room = await this.RoomRepo.save(newRoom);
    const savedRoom = await this.RoomRepo.findOneOrFail({
      where: { id: room.id },
    });
    return this.mapEntityToType(savedRoom);
  }

  async updateRoom(
    id: string,
    input: Partial<createRoomInput>,
  ): Promise<RoomType> {
    await this.RoomRepo.update({ id }, input);
    const room = await this.RoomRepo.findOneOrFail({ where: { id } });
    return this.mapEntityToType(room);
  }

  async deleteRoom(id: string): Promise<boolean> {
    const room = await this.RoomRepo.findOneOrFail({ where: { id } });
    if (!room) {
      return false;
    }
    await this.RoomRepo.delete({ id });
    return true;
  }

  private mapEntityToType(entity: RoomEntity): RoomType {
    const roomType = new RoomType();
    roomType.id = entity.id;
    roomType.name = entity.name;
    roomType.capacity = entity.capacity;
    roomType.location = entity.location;
    roomType.createdAt = entity.created_at;
    
    // Convertir les réservations si elles sont chargées
    roomType.reservations = entity.reservations
      ? entity.reservations.map((res) => this.mapReservationEntityToType(res))
      : [];
    
    return roomType;
  }

  private mapReservationEntityToType(
    entity: ReservationEntity,
  ): ReservationType {
    const reservationType = new ReservationType();
    reservationType.id = entity.id;
    reservationType.userId = entity.user?.id || '';
    reservationType.roomId = entity.room?.id || '';
    reservationType.startTime = entity.start_time;
    reservationType.endTime = entity.end_time;
    reservationType.createdAt = entity.created_at;
    return reservationType;
  }
}
