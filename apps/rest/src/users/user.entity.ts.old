import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ description: 'Unique identifier of the user (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Keycloak identifier' })
  @Column({ unique: true, name: 'keycloak_id' })
  keycloakId: string;

  @ApiProperty({ description: 'Creation date of the user' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Email address', required: false })
  @Column({ nullable: true })
  email: string;
}
