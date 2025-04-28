import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '@app/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(skip = 0, limit = 10): Promise<UserEntity[]> {
    return await this.userRepository.find({
      skip,
      take: limit,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    if (loginDto.password !== 'password') {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return { accessToken: 'dummy-jwt-token' };
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create({
      keycloak_id: `${createUserDto.email}-keycloak-id`,
      email: createUserDto.email,
    });
    return await this.userRepository.save(newUser);
  }

  async extract(userId: string): Promise<{ url: string }> {
    await this.findOne(userId);
    return { url: `http://minio/download/${userId}/reservations.csv` };
  }
}
