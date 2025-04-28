import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { MinioService, ReservationEntity, UserEntity } from '@app/shared';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';
import { parse } from 'json2csv';
import { promises as fs } from 'fs';
import * as path from 'path';

interface ExtractsService {
  generateUserExtract(data: { user_id: number }): Observable<{ url: string }>;
}

// Mock du service gRPC pour éviter les erreurs si le service n'est pas disponible
class MockExtractsService implements ExtractsService {
  generateUserExtract(data: { user_id: number }): Observable<{ url: string }> {
    return of({ url: `http://minio/extract/${data.user_id}.csv` });
  }
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private client: ClientGrpc | null = null;
  private extractsService: ExtractsService;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
    private readonly minioService: MinioService,
  ) {
    // Initialiser avec le mock par défaut
    this.extractsService = new MockExtractsService();
  }

  async findAll(skip = 0, limit = 10): Promise<UserEntity[]> {
    return await this.userRepository.find({
      skip,
      take: limit,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    if (loginDto.password !== 'password') {
      throw new UnauthorizedException('Identifiants invalides');
    }
    return { accessToken: 'dummy-jwt-token' };
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create({
      keycloak_id: `${createUserDto.email}-keycloak-id`,
      email: createUserDto.email,
    });
    return await this.userRepository.save(newUser);
  }

  async extract(userId: string): Promise<{ url: string }> {
    // Vérifier que l'utilisateur existe
    await this.findOne(userId);
    
    try {
      // Récupérer les réservations pour l'utilisateur
      const reservations = await this.reservationRepository.find({
        where: { user_id: userId },
        relations: ['room'],
      });

      // Transformer les données pour le format CSV
      const csvData = reservations.map((reservation) => ({
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
      let csvContent = '';

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
      
      // S'assurer que le bucket existe avant de tenter d'uploader le fichier
      const bucketExists = await this.minioService.bucketExists(bucketName);
      if (!bucketExists) {
        this.logger.log(`Le bucket ${bucketName} n'existe pas, création...`);
        await this.minioService.createBucket(bucketName);
        this.logger.log(`Bucket ${bucketName} créé avec succès`);
      }

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error(`Erreur lors de la génération du CSV: ${errorMessage}`);
      
      throw new Error("Erreur lors de la génération de l'extrait CSV");
    }
  }
}
