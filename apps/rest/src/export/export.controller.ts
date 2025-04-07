import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ExportService } from './export.service';

@Controller()
export class ExportController {
  constructor(private readonly exportService: ExportService) { }

  @GrpcMethod('ExportService', 'ExportReservations')
  async exportReservations(data: { user_id: number }): Promise<{ url: string }> {
    return await this.exportService.exportReservations(data);
  }
}
