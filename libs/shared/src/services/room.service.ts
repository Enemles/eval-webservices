import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../entities/room.entity';
import { RoomType, createRoomInput } from '../types/room.type';
import { ReservationType } from '../types/reservation.type';
import { ReservationEntity } from '../entities/reservation.entity';
import { Logger, NotFoundException } from '@nestjs/common';

export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    @InjectRepository(RoomEntity)
    private readonly RoomRepo: Repository<RoomEntity>,
  ) {}

  async listRooms(skip?: number, limit?: number): Promise<RoomType[]> {
    this.logger.log(`listRooms: skip=${skip}, limit=${limit}`);
    
    const options: { skip?: number; take?: number } = {};

    // Ajouter la pagination si spécifiée
    if (skip !== undefined && limit !== undefined) {
      options.skip = skip;
      options.take = limit;
    }

    try {
      // Simplifier - ne pas charger les relations pour la liste
      const rooms = await this.RoomRepo.find(options);
      this.logger.log(`listRooms: ${rooms.length} salles trouvées`);
      return rooms.map((room) => this.mapEntityToType(room));
    } catch (error) {
      this.logger.error(`Erreur listRooms: ${error.message}`, error.stack);
      throw error;
    }
  }

  async room(id: string): Promise<RoomType | null> {
    this.logger.log(`room: recherche de la salle avec ID ${id}`);
    
    try {
      const room = await this.RoomRepo.findOne({
        where: { id },
        relations: ['reservations', 'reservations.room', 'reservations.user'],
      });
      
      if (!room) {
        this.logger.warn(`room: salle avec ID ${id} non trouvée`);
        return null;
      }
      
      this.logger.log(`room: salle avec ID ${id} trouvée`);
      return this.mapEntityToType(room);
    } catch (error) {
      this.logger.error(`Erreur room: ${error.message}`, error.stack);
      throw error;
    }
  }

  async createRoom(input: createRoomInput): Promise<RoomType> {
    this.logger.log(`createRoom: création d'une nouvelle salle - ${JSON.stringify(input)}`);
    
    try {
      const newRoom = this.RoomRepo.create(input);
      const room = await this.RoomRepo.save(newRoom);
      const savedRoom = await this.RoomRepo.findOne({
        where: { id: room.id },
      });
      
      if (!savedRoom) {
        throw new Error('Failed to retrieve saved room');
      }
      
      this.logger.log(`createRoom: salle créée avec ID ${savedRoom.id}`);
      return this.mapEntityToType(savedRoom);
    } catch (error) {
      this.logger.error(`Erreur createRoom: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateRoom(
    id: string,
    input: Partial<createRoomInput>,
  ): Promise<RoomType> {
    this.logger.log(`updateRoom: mise à jour de la salle ${id} - ${JSON.stringify(input)}`);
    
    try {
      // Vérifier que la salle existe
      const existingRoom = await this.RoomRepo.findOne({ where: { id } });
      if (!existingRoom) {
        this.logger.warn(`updateRoom: salle avec ID ${id} non trouvée`);
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      // Filtrer les valeurs undefined
      const updateData = Object.fromEntries(
        Object.entries(input).filter(([_, value]) => value !== undefined)
      );

      if (Object.keys(updateData).length === 0) {
        this.logger.log(`updateRoom: aucune donnée à mettre à jour pour la salle ${id}`);
        return this.mapEntityToType(existingRoom);
      }

      await this.RoomRepo.update({ id }, updateData);
      const room = await this.RoomRepo.findOne({ where: { id } });
      
      if (!room) {
        throw new Error('Failed to retrieve updated room');
      }
      
      this.logger.log(`updateRoom: salle ${id} mise à jour avec succès`);
      return this.mapEntityToType(room);
    } catch (error) {
      this.logger.error(`Erreur updateRoom: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteRoom(id: string): Promise<boolean> {
    this.logger.log(`deleteRoom: suppression de la salle ${id}`);
    
    try {
      const room = await this.RoomRepo.findOne({ where: { id } });
      if (!room) {
        this.logger.warn(`deleteRoom: salle avec ID ${id} non trouvée`);
        throw new NotFoundException(`Room with ID ${id} not found`);
      }
      
      await this.RoomRepo.delete({ id });
      this.logger.log(`deleteRoom: salle ${id} supprimée avec succès`);
      return true;
    } catch (error) {
      this.logger.error(`Erreur deleteRoom: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      return false;
    }
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
