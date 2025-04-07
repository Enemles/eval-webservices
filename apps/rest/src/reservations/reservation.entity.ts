import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Check } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'reservations' })
@Check(`"start_time" < "end_time"`)
export class Reservation {
  @ApiProperty({ description: 'Unique identifier of the reservation (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User identifier' })
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty({ description: 'Room identifier' })
  @Column({ name: 'room_id' })
  roomId: string;

  @ApiProperty({ description: 'Start time of the reservation', type: String })
  @Column({ name: 'start_time' })
  startTime: Date;

  @ApiProperty({ description: 'End time of the reservation', type: String })
  @Column({ name: 'end_time' })
  endTime: Date;

  @ApiProperty({ description: 'Creation date of the reservation', type: String })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Status of the reservation', enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' })
  @Column({ default: 'pending' })
  status: string;
}
