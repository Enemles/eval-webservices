import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtractsController } from './extracts.controller';
import { ExtractsService } from './extracts.service';
import { ReservationEntity, UserEntity, SharedMinioModule } from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationEntity, UserEntity]),
    SharedMinioModule,
  ],
  controllers: [ExtractsController],
  providers: [ExtractsService],
})
export class ExtractsModule {}
 