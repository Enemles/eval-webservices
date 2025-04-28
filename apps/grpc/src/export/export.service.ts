import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MinioService, ReservationEntity, UserEntity } from '@app/shared';
import { parse } from 'json2csv';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(
    private readonly minioService: MinioService,
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async exportReservations(data: { userId: string }): Promise<{ url: string }> {
    if (!data.userId) {
      this.logger.error('userId est undefined ou null');
      throw new Error('userId est requis');
    }

    this.logger.log(`Début de l'export pour l'utilisateur: ${data.userId}`);
    
    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });
    
    if (!user) {
      this.logger.error(`Utilisateur avec ID ${data.userId} non trouvé`);
      throw new NotFoundException(`Utilisateur avec ID ${data.userId} non trouvé`);
    }

    this.logger.log(`Utilisateur trouvé: ${JSON.stringify(user)}`);

    // Récupérer les réservations réelles pour l'utilisateur depuis la base de données
    const reservations = await this.reservationRepository.find({
      where: { user_id: data.userId },
      relations: ['room'],
    });

    this.logger.log(`Nombre de réservations trouvées: ${reservations.length}`);

    if (reservations.length === 0) {
      this.logger.log(`Aucune réservation trouvée pour l'utilisateur ${data.userId}`);
    }

    // Transformer les données pour le format CSV
    const reservationData = reservations.map((reservation) => ({
      id: reservation.id,
      userId: reservation.user_id,
      roomId: reservation.room_id,
      startTime: reservation.start_time.toISOString(),
      endTime: reservation.end_time.toISOString(),
      createdAt: reservation.created_at.toISOString(),
      status: reservation.status,
    }));

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
    let csv: string;
    try {
      const result = parse(reservationData, opts);
      if (typeof result === 'string') {
        csv = result;
      } else {
        throw new Error('La conversion CSV a échoué');
      }
    } catch (err) {
      this.logger.error('Erreur lors de la génération du CSV', err);
      throw err;
    }

    // Créer un fichier temporaire
    const fileName = `reservations_${data.userId}_${uuidv4()}.csv`;
    const tmpDir = path.join(__dirname, '..', '..', 'tmp');
    const filePath = path.join(tmpDir, fileName);

    this.logger.log(`Création du fichier temporaire: ${filePath}`);

    // S'assurer que le répertoire temporaire existe
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(filePath, csv);
    this.logger.log(`Fichier CSV généré à ${filePath}`);

    // Uploader le fichier sur MinIO
    const bucketName = 'exports';
    
    // Vérifier si le bucket existe et le créer si nécessaire
    const bucketExists = await this.minioService.bucketExists(bucketName);
    if (!bucketExists) {
      this.logger.log(`Le bucket ${bucketName} n'existe pas, création...`);
      await this.minioService.createBucket(bucketName);
      this.logger.log(`Bucket ${bucketName} créé avec succès`);
    }
    
    await this.minioService.uploadFile(bucketName, fileName, filePath);
    this.logger.log(`Fichier CSV uploadé comme ${fileName} dans le bucket ${bucketName}`);

    // Générer une URL pré-signée (valide 5 minutes)
    const url = await this.minioService.getPresignedUrl(
      bucketName,
      fileName,
      60 * 5,
    );

    this.logger.log(`URL présignée générée: ${url}`);

    // Supprimer le fichier temporaire
    await fs.unlink(filePath);

    return { url };
  }
}
