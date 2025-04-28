import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private client: Minio.Client;
  private readonly logger = new Logger(MinioService.name);

  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
      secretKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
    });
  }

  async bucketExists(bucketName: string): Promise<boolean> {
    try {
      await this.client.bucketExists(bucketName);
      return true;
    } catch (error) {
      return false;
    }
  }

  async createBucket(bucketName: string): Promise<void> {
    if (!(await this.bucketExists(bucketName))) {
      await this.client.makeBucket(bucketName, '');
      this.logger.log(`Bucket ${bucketName} created`);
    }
  }

  async uploadFile(
    bucketName: string,
    objectName: string,
    filePath: string,
  ): Promise<void> {
    await this.createBucket(bucketName);
    await this.client.fPutObject(bucketName, objectName, filePath, {});
    this.logger.log(`Uploaded ${objectName} to ${bucketName}`);
  }

  async getPresignedUrl(
    bucketName: string,
    objectName: string,
    expiry = 24 * 60 * 60,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // On force le typage en utilisant "as any" pour contourner le problème de typage
      (this.client.presignedGetObject as any)(
        bucketName,
        objectName,
        expiry,
        (err: any, url: string) => {
          if (err) {
            this.logger.error('Error generating presigned URL', err);
            return reject(err);
          }
          resolve(url);
        },
      );
    });
  }
}
