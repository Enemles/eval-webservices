import { RoomService } from '@app/shared/services/room.service';
import { createRoomInput, RoomType } from '@app/shared/types/room.type';
import { Args, Int, Mutation, Query, Resolver, ID } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';

@Resolver(() => RoomType)
export class RoomResolver {
  private readonly logger = new Logger(RoomResolver.name);

  constructor(private readonly roomService: RoomService) {}

  @Query(() => [RoomType])
  async listRooms(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<RoomType[]> {
    this.logger.log(`Query listRooms: skip=${skip}, limit=${limit}`);
    try {
      const result = await this.roomService.listRooms(skip, limit);
      this.logger.log(`listRooms résultat: ${result.length} salles trouvées`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur listRooms: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Query(() => RoomType, { nullable: true })
  async room(@Args('id', { type: () => ID }) id: string): Promise<RoomType | null> {
    this.logger.log(`Query room: id=${id}`);
    try {
      const result = await this.roomService.room(id);
      this.logger.log(`room résultat: ${result ? 'trouvée' : 'non trouvée'}`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur room: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Mutation(() => RoomType)
  async createRoom(
    @Args('name') name: string,
    @Args('capacity', { type: () => Int }) capacity: number,
    @Args('location') location: string,
  ): Promise<RoomType> {
    this.logger.log(`Mutation createRoom: name=${name}, capacity=${capacity}, location=${location}`);
    try {
      const result = await this.roomService.createRoom({ name, capacity, location });
      this.logger.log(`createRoom résultat: salle créée avec ID ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur createRoom: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Mutation(() => RoomType)
  async updateRoom(
    @Args('id', { type: () => ID }) id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('capacity', { type: () => Int, nullable: true }) capacity?: number,
    @Args('location', { nullable: true }) location?: string,
  ): Promise<RoomType> {
    this.logger.log(`Mutation updateRoom: id=${id}, name=${name}, capacity=${capacity}, location=${location}`);
    try {
      const result = await this.roomService.updateRoom(id, { name, capacity, location });
      this.logger.log(`updateRoom résultat: salle mise à jour avec ID ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur updateRoom: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async deleteRoom(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    this.logger.log(`Mutation deleteRoom: id=${id}`);
    try {
      const result = await this.roomService.deleteRoom(id);
      this.logger.log(`deleteRoom résultat: ${result ? 'supprimée' : 'échec'}`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur deleteRoom: ${error.message}`, error.stack);
      throw error;
    }
  }
}
