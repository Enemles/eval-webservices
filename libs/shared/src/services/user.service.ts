import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { createUserInput, UserType } from '../types/user.type';
import { ReservationType } from '../types/reservation.type';
import { ReservationEntity } from '../entities/reservation.entity';

export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async listUsers(): Promise<UserType[]> {
    const users = await this.userRepo.find({
      relations: ['reservations', 'reservations.user'],
    });
    return users.map((user) => this.mapEntityToType(user));
  }

  async user(id: string): Promise<UserType> {
    const user = await this.userRepo.findOneOrFail({ where: { id } });
    return this.mapEntityToType(user);
  }

  async updateUser(id: string, input: createUserInput): Promise<UserType> {
    await this.userRepo.update({ id }, input);
    const user = await this.userRepo.findOneOrFail({ where: { id } });
    return this.mapEntityToType(user);
  }

  async deleteUser(id: string): Promise<UserType> {
    const user = await this.userRepo.findOneOrFail({ where: { id } });
    await this.userRepo.delete({ id });
    return this.mapEntityToType(user);
  }

  private mapEntityToType(entity: UserEntity): UserType {
    const userType = new UserType();
    userType.id = entity.id;
    userType.keycloakId = entity.keycloak_id;
    userType.email = entity.email;
    userType.createdAt = entity.created_at;
    
    // Convertir les réservations si elles sont chargées
    userType.reservations = entity.reservations ? 
      entity.reservations.map(res => this.mapReservationEntityToType(res)) : 
      [];
    
    return userType;
  }

  private mapReservationEntityToType(entity: ReservationEntity): ReservationType {
    const reservationType = new ReservationType();
    reservationType.id = entity.id;
    reservationType.userId = entity.user.id;
    reservationType.roomId = entity.room.id;
    reservationType.startTime = entity.start_time;
    reservationType.endTime = entity.end_time;
    reservationType.createdAt = entity.created_at;
    return reservationType;
  }
}
