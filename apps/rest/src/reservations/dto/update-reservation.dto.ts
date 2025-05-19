import { IsOptional, IsString, IsISO8601, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservationDto {
  @ApiProperty({
    description: "Identifiant de l'utilisateur",
    example: "ac2f30c9-5d55-4cb5-8b59-d92557884648",
    required: false
  })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiProperty({
    description: "Identifiant de la salle",
    example: "0743c8ad-a9fd-4512-93d0-acc23887f05f",
    required: false
  })
  @IsOptional()
  @IsString()
  room_id?: string;

  @ApiProperty({
    description: "Date et heure de début (ISO8601)",
    example: "2025-07-15T09:00:00",
    required: false
  })
  @IsOptional()
  @IsISO8601()
  start_time?: string;

  @ApiProperty({
    description: "Date et heure de fin (ISO8601)",
    example: "2025-07-15T11:00:00",
    required: false
  })
  @IsOptional()
  @IsISO8601()
  end_time?: string;

  @ApiProperty({
    description: "Statut de la réservation",
    example: "approved",
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    required: false
  })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'approved', 'rejected', 'cancelled'])
  status?: string;

  // Compatibilité avec les noms en camelCase
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  roomId?: string;

  @IsOptional()
  @IsISO8601()
  startTime?: string;

  @IsOptional()
  @IsISO8601()
  endTime?: string;
}
