import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReservationEntity } from './reservation.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'keycloak_id',
  })
  keycloak_id: string;

  @Column()
  email: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.user, {
    cascade: true,
    eager: true,
  })
  reservations: ReservationEntity[];
}
