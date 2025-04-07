import { Shared } from '@app/shared';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifEntity } from 'entities/notif.entity';
import { ReservationEntity } from 'entities/reservation.entity';
import { RoomEntity } from 'entities/room.entity';
import { UserEntity } from 'entities/user.entity';
import { join } from 'path';
import { NotifResolver } from 'resolver/notif.resolver';
import { ReservationResolver } from 'resolver/reservation.resolver';
import { RoomResolver } from 'resolver/room.resolver';
import { UserResolver } from 'resolver/user.resolver';
import { authController } from 'src/controllers/auth.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    Shared,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),

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
  controllers: [AppController, authController],
  providers: [
    AppService,
    UserResolver,
    RoomResolver,
    NotifResolver,
    ReservationResolver,
  ],
})
export class AppModule {}
