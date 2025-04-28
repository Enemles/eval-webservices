import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private client: Minio.Client;
  private readonly logger = new Logger(MinioService.name);

  constructor() {
    const endPoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = parseInt(process.env.MINIO_PORT || '9000', 10);
    const accessKey = process.env.MINIO_ROOT_USER || 'minioadmin';
    const secretKey = process.env.MINIO_ROOT_PASSWORD || 'minioadmin';

    this.logger.log(`Initializing MinIO client with: ${endPoint}:${port}, user: ${accessKey}`);

    this.client = new Minio.Client({
      endPoint,
      port,
      useSSL: false,
      accessKey,
      secretKey,
    });
  }

  async bucketExists(bucketName: string): Promise<boolean> {
    try {
      this.logger.log(`Checking if bucket ${bucketName} exists...`);
      const exists = await this.client.bucketExists(bucketName);
      this.logger.log(`Bucket ${bucketName} exists: ${exists}`);
      return exists;
    } catch (error) {
      this.logger.error(`Error checking if bucket ${bucketName} exists:`, error);
      return false;
    }
  }

  async createBucket(bucketName: string): Promise<void> {
    try {
      const exists = await this.bucketExists(bucketName);
      if (!exists) {
        this.logger.log(`Creating bucket ${bucketName}...`);
        await this.client.makeBucket(bucketName, '');
        this.logger.log(`Bucket ${bucketName} created successfully`);

        // Définir une politique d'accès en lecture publique sur le bucket
        await this.setBucketPolicy(bucketName);
      } else {
        this.logger.log(`Bucket ${bucketName} already exists`);
        // S'assurer que la politique est définie même pour un bucket existant
        await this.setBucketPolicy(bucketName);
      }
    } catch (error: any) {
      this.logger.error(`Error creating bucket ${bucketName}:`, error);
      throw new Error(`Could not create bucket: ${error.message}`);
    }
  }

  async setBucketPolicy(bucketName: string): Promise<void> {
    try {
      this.logger.log(`Setting public read policy for bucket ${bucketName}...`);

      // Créer une politique qui permet l'accès en lecture aux objets du bucket
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              AWS: ['*'],
            },
            Action: [
              's3:GetObject',
              's3:ListBucket',
            ],
            Resource: [
              `arn:aws:s3:::${bucketName}`,
              `arn:aws:s3:::${bucketName}/*`,
            ],
          },
        ],
      };

      await this.client.setBucketPolicy(bucketName, JSON.stringify(policy));
      this.logger.log(`Public read policy set for bucket ${bucketName}`);
    } catch (error: any) {
      this.logger.error(`Error setting bucket policy for ${bucketName}:`, error);
      throw new Error(`Failed to set bucket policy: ${error.message}`);
    }
  }

  async uploadFile(
    bucketName: string,
    objectName: string,
    filePath: string,
  ): Promise<void> {
    try {
      // Ensure bucket exists before uploading
      await this.createBucket(bucketName);

      this.logger.log(`Uploading ${filePath} to ${bucketName}/${objectName}...`);
      await this.client.fPutObject(bucketName, objectName, filePath, {});
      this.logger.log(`Successfully uploaded ${objectName} to ${bucketName}`);
    } catch (error: any) {
      this.logger.error(`Error uploading file to ${bucketName}/${objectName}:`, error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async getPresignedUrl(
    bucketName: string,
    objectName: string,
    expiry = 24 * 60 * 60,
  ): Promise<string> {
    this.logger.log(`Generating presigned URL for ${bucketName}/${objectName} (expires in ${expiry}s)`);

    // Utiliser la méthode non asynchrone directement (sans callback)
    try {
      const url = await this.client.presignedUrl('GET', bucketName, objectName, expiry);
      this.logger.log(`Successfully generated presigned URL for ${bucketName}/${objectName}`);
      return url;
    } catch (error: any) {
      this.logger.error(`Error generating presigned URL for ${bucketName}/${objectName}:`, error);
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }
}
