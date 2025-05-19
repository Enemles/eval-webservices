import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ExportService } from './export.service';

@Controller()
export class ExportController {
  private readonly logger = new Logger(ExportController.name);

  constructor(private readonly exportService: ExportService) {}

  @GrpcMethod('ExportService', 'ExportReservations')
  async exportReservations(data: { user_id?: string; userId?: string }): Promise<{ url: string }> {
    this.logger.log(`Objet data complet reçu : ${JSON.stringify(data)}`);
    
    // Récupérer l'ID utilisateur à partir de user_id ou userId
    const userId = data.userId || data.user_id;
    
    this.logger.log(`ID utilisateur extrait : ${userId}`);
    
    if (!userId) {
      throw new Error('ID utilisateur non fourni. Utilisez "user_id" ou "userId" dans votre requête.');
    }
    
    return await this.exportService.exportReservations({ userId });
  }
}
