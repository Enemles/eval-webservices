import { SharedModule } from '@app/shared';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifResolver } from './resolver/notif.resolver';
import { ReservationResolver } from './resolver/reservation.resolver';
import { RoomResolver } from './resolver/room.resolver';
import { UserResolver } from './resolver/user.resolver';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserResolver,
    RoomResolver,
    NotifResolver,
    ReservationResolver,
  ],
})
export class AppModule {}
