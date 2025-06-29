import { Injectable } from '@nestjs/common';

@Injectable()
export class ExportService {
  async exportReservations(data: { user_id: number }): Promise<{ url: string }> {
    const minioEndpoint = process.env.MINIO_ENDPOINT || 'minio';
    const minioPort = process.env.MINIO_PORT || '9000';
    const url = `http://${minioEndpoint}:${minioPort}/download/${data.user_id}/reservations.csv`;
    return { url };
  }
}
