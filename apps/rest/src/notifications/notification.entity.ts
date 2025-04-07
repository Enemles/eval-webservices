import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'notifications' })
export class Notification {
  @ApiProperty({ description: 'Unique identifier of the notification (number)' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Reservation identifier' })
  @Column({ name: 'reservation_id' })
  reservationId: number;

  @ApiProperty({ description: 'Notification message' })
  @Column('text')
  message: string;

  @ApiProperty({ description: 'Notification date', type: String })
  @Column({ name: 'notification_date' })
  notificationDate: Date;

  @ApiProperty({ description: 'Indicates if the notification is sent', default: false })
  @Column({ default: false })
  isSent: boolean;
}
