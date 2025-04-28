import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomEntity } from '@app/shared';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  providers: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
