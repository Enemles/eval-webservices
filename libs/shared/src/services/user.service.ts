import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { createUserInput, UserType } from '../types/user.type';

export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async listUsers(): Promise<UserType[]> {
    return this.userRepo.find({
      relations: ['reservations', 'reservations.user'],
    });
  }

  async user(id: string): Promise<UserType> {
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  async updateUser(id: string, input: createUserInput): Promise<UserType> {
    await this.userRepo.update({ id }, input);
    return this.userRepo.findOneOrFail({ where: { id } });
  }

  async deleteUser(id: string): Promise<UserType> {
    const user = await this.userRepo.findOneOrFail({ where: { id } });
    await this.userRepo.delete({ id });
    return user;
  }
}
