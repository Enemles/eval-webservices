import { Injectable } from '@nestjs/common';

@Injectable()
export class ExportService {
  async exportReservations(data: { user_id: number }): Promise<{ url: string }> {
    const url = `http://minio/download/${data.user_id}/reservations.csv`;
    return { url };
  }
}
