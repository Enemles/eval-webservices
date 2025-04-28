import { AuthModule, RoomEntity } from '@app/shared';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity]),
    AuthModule,
  ],
  providers: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
