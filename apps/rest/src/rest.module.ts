import { Module } from '@nestjs/common';
import { RestController } from './rest.controller';
import { RestService } from './rest.service';

@Module({
  imports: [],
  controllers: [RestController],
  providers: [RestService],
})
export class RestModule {}
