import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinioService, ReservationEntity, UserEntity } from '@app/shared';
import { parse } from 'json2csv';
import { promises as fs } from 'fs';
import * as path from 'path';

interface CsvRow {
  reservation_id: string;
  user_id: string;
  room_id: string;
  start_time: string;
  end_time: string;
  status: string;
}

@Injectable()
export class ExtractsService {
  private readonly logger = new Logger(ExtractsService.name);

  constructor(
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly minioService: MinioService,
  ) {}

  async generateUserExtract(userId: number): Promise<{ url: string }> {
    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findOne({
      where: { id: String(userId) },
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec ID ${userId} non trouvé`);
    }

    // Récupérer les réservations pour l'utilisateur
    const reservations = await this.reservationRepository.find({
      where: { user_id: String(userId) },
      relations: ['room'],
    });

    // Transformer les données pour le format CSV
    const csvData: CsvRow[] = reservations.map((reservation) => ({
      reservation_id: reservation.id,
      user_id: reservation.user_id,
      room_id: reservation.room_id,
      start_time: reservation.start_time.toISOString(),
      end_time: reservation.end_time.toISOString(),
      status: reservation.status,
    }));

    // Convertir les données en CSV
    const fields = [
      'reservation_id',
      'user_id',
      'room_id',
      'start_time',
      'end_time',
      'status',
    ];
    const opts = { fields };
    let csvContent: string;

    try {
      // Utiliser la fonction parse sans risquer un typage incorrect
      const result = parse(csvData, opts);
      if (typeof result === 'string') {
        csvContent = result;
      } else {
        throw new Error('La conversion CSV a échoué');
      }
    } catch (error) {
      this.logger.error('Erreur lors de la génération du CSV', error);
      throw new Error('Erreur lors de la génération du CSV');
    }

    // Créer un fichier temporaire
    const fileName = `user_${userId}_${Date.now()}.csv`;
    const tmpDir = path.join(__dirname, '..', '..', '..', 'tmp');
    const filePath = path.join(tmpDir, fileName);

    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(filePath, csvContent);
    this.logger.log(`Fichier CSV généré à ${filePath}`);

    // Uploader le fichier sur MinIO
    const bucketName = 'reservations-csv';
    const objectName = `extracts/${fileName}`;

    await this.minioService.uploadFile(bucketName, objectName, filePath);
    this.logger.log(
      `Fichier CSV uploadé comme ${objectName} dans le bucket ${bucketName}`,
    );

    // Générer une URL pré-signée (valide 5 minutes)
    const url = await this.minioService.getPresignedUrl(
      bucketName,
      objectName,
      60 * 5,
    );

    // Supprimer le fichier temporaire
    await fs.unlink(filePath);

    return { url };
  }
}
