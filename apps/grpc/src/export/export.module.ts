import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { SharedMinioModule, ReservationEntity, UserEntity } from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    SharedMinioModule,
    TypeOrmModule.forFeature([ReservationEntity, UserEntity]),
  ],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}
 