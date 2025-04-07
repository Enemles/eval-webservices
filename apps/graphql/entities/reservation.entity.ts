import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotifEntity } from './notif.entity';
import { RoomEntity } from './room.entity';
import { UserEntity } from './user.entity';

@Entity('reservation')
export class ReservationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
  })
  user_id: string;

  @Column({
    name: 'room_id',
  })
  room_id: string;

  @Column({
    name: 'start_time',
  })
  start_time: Date;

  @Column({
    name: 'end_time',
  })
  end_time: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  @Column()
  status: string;

  @JoinColumn({
    name: 'user_id',
  })
  @ManyToOne(() => UserEntity, (user) => user.reservations)
  user: UserEntity;

  @JoinColumn({
    name: 'room_id',
  })
  @ManyToOne(() => RoomEntity, (room) => room.reservations)
  room: RoomEntity;

  @OneToMany(() => NotifEntity, (notification) => notification.reservation, {
    cascade: true,
    eager: true,
  })
  notifications: NotifEntity[];
}
