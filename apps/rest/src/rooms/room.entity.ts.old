import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'rooms' })
export class Room {
  @ApiProperty({ description: 'Unique identifier of the room (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Name of the room' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Maximum capacity of the room' })
  @Column()
  capacity: number;

  @ApiProperty({ description: 'Location of the room' })
  @Column({ nullable: true })
  location: string;

  @ApiProperty({ description: 'Creation date of the room' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
