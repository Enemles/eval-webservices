import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ExtractsService } from './extracts.service';

@Controller()
export class ExtractsController {
  constructor(private readonly extractsService: ExtractsService) {}

  @GrpcMethod('Extracts', 'GenerateUserExtract')
  async generateUserExtract(data: {
    user_id: number;
  }): Promise<{ url: string }> {
    return await this.extractsService.generateUserExtract(data.user_id);
  }
}
