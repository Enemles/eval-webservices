import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findAll(skip = 0, limit = 10): Promise<User[]> {
    return await this.userRepository.find({
      skip,
      take: limit,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    if (loginDto.password !== 'password') {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return { accessToken: 'dummy-jwt-token' };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create({
      keycloakId: `${createUserDto.email}-keycloak-id`,
      email: createUserDto.email,
    });
    return await this.userRepository.save(newUser);
  }

  async extract(userId: string): Promise<{ url: string }> {
    await this.findOne(userId);
    return { url: `http://minio/download/${userId}/reservations.csv` };
  }
}
