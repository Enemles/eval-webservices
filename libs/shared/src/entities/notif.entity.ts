import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReservationEntity } from './reservation.entity';

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
  notification_date: Date;

  @ApiProperty({
    description: 'Indicates if notification has been sent',
    default: false,
  })
  @Column({ name: 'is_sent', default: false })
  is_sent: boolean;

  @ManyToOne(
    () => ReservationEntity,
    (reservation) => reservation.notifications,
  )
  @JoinColumn({ name: 'reservation_id' })
  reservation: ReservationEntity;
}
