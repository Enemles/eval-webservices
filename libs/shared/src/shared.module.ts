import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifEntity } from './entities/notif.entity';
import { ReservationEntity } from './entities/reservation.entity';
import { RoomEntity } from './entities/room.entity';
import { UserEntity } from './entities/user.entity';
import { NotifService } from './services/notif.service';
import { ReservationService } from './services/reservation.service';
import { RoomService } from './services/room.service';
import { UserService } from './services/user.service';
import { SharedService } from './shared.service';

@Module({
  imports: [
    ConfigModule.forRoot(),

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
  ],
  exports: [
    SharedService,
    RoomService,
    ReservationService,
    NotifService,
    UserService,
  ],
})
export class SharedModule {}
