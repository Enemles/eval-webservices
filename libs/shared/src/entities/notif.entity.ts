import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('notif')
export class NotifEntity {
  @ApiProperty({ description: 'Unique identifier (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Reservation identifier' })
  @Column({ name: 'reservation_id' })
  @Index()
  reservation_id: string;

  @ApiProperty({ description: 'Notification message' })
  @Column()
  message: string;

  @ApiProperty({ description: 'Notification date', type: String })
  @CreateDateColumn({ name: 'notification_date' })
  notificationDate: Date;

  @ApiProperty({
    description: 'Indicates if notification has been sent',
    default: false,
  })
  @Column({ name: 'is_sent' })
  isSent: boolean;

  @ManyToOne(
    () => ReservationEntity,
    (reservation) => reservation.notifications,
  )
  @JoinColumn({ name: 'reservation_id' })
  reservation: ReservationEntity;
}
