import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { NotifEntity } from './entities/notif.entity';
import { ReservationEntity } from './entities/reservation.entity';
import { RoomEntity } from './entities/room.entity';
import { UserEntity } from './entities/user.entity';
import { AuthService } from './services/auth/auth.service';
import { NotifService } from './services/notif.service';
import { ReservationService } from './services/reservation.service';
import { RoomService } from './services/room.service';
import { UserService } from './services/user.service';
import { SharedService } from './shared.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pguser',
      password: 'pgpass',
      database: 'pgdb',
      entities: [UserEntity, RoomEntity, ReservationEntity, NotifEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      RoomEntity,
      ReservationEntity,
      NotifEntity,
    ]),
  ],
  providers: [
    SharedService,
    RoomService,
    ReservationService,
    NotifService,
    UserService,
    AuthService,
  ],
  exports: [
    SharedService,
    RoomService,
    ReservationService,
    NotifService,
    UserService,
    AuthService,
    AuthModule,
  ],
  controllers: [AuthController],
})
export class SharedModule { }
