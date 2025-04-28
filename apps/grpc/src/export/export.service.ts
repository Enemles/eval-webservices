import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from '@app/shared';
import { parse } from 'json2csv';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(private readonly minioService: MinioService) {}

  async exportReservations(data: { userId: number }): Promise<{ url: string }> {
    // Récupérer les réservations pour l'utilisateur
    // Remplacez cette partie par votre logique réelle
    const reservations = this.getReservationsForUser(data.userId);

    // Convertir les données en CSV
    const fields = [
      'id',
      'userId',
      'roomId',
      'startTime',
      'endTime',
      'createdAt',
      'status',
    ];
    const opts = { fields };
    let csv;
    try {
      csv = parse(reservations, opts);
    } catch (err) {
      this.logger.error('Error generating CSV', err);
      throw err;
    }

    // Créer un fichier temporaire
    const fileName = `reservations_${data.userId}_${uuidv4()}.csv`;
    const filePath = path.join(__dirname, '..', '..', 'tmp', fileName);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, csv);
    this.logger.log(`CSV file generated at ${filePath}`);

    // Uploader le fichier sur MinIO
    const bucketName = 'exports';
    await this.minioService.uploadFile(bucketName, fileName, filePath);
    this.logger.log(`CSV file uploaded as ${fileName} in bucket ${bucketName}`);

    // Générer une URL pré-signée
    const url = await this.minioService.getPresignedUrl(bucketName, fileName);

    // Supprimer le fichier temporaire
    await fs.unlink(filePath);

    return { url };
  }

  // Stub pour récupérer les réservations (à remplacer par votre logique réelle)
  private getReservationsForUser(userId: number): any[] {
    return [
      {
        id: 'uuid1',
        userId,
        roomId: 101,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        status: 'approved',
      },
      {
        id: 'uuid2',
        userId,
        roomId: 102,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 7200000).toISOString(),
        createdAt: new Date().toISOString(),
        status: 'pending',
      },
    ];
  }
}
