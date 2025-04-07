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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'reservation_id',
  })
  @Index()
  reservation_id: string;

  @Column()
  message: string;

  @CreateDateColumn({
    name: 'notification_date',
  })
  notification_date: Date;

  @Column({
    name: 'is_sent',
  })
  is_sent: boolean;

  @ManyToOne(
    () => ReservationEntity,
    (reservation) => reservation.notifications,
  )
  @JoinColumn({
    name: 'reservation_id',
  })
  reservation: ReservationEntity;
}
