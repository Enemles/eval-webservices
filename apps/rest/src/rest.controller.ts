import { Controller, Get } from '@nestjs/common';
import { RestService } from './rest.service';

@Controller()
export class RestController {
  constructor(private readonly restService: RestService) {}

  @Get()
  getHello(): string {
    return this.restService.getHello();
  }
}
