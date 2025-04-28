import { IsNotEmpty, IsString, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    description: "Identifiant de l'utilisateur",
    example: "ac2f30c9-5d55-4cb5-8b59-d92557884648"
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: "Identifiant de la salle",
    example: "0743c8ad-a9fd-4512-93d0-acc23887f05f"
  })
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @ApiProperty({
    description: "Date et heure de début (ISO8601)",
    example: "2025-07-15T09:00:00"
  })
  @IsNotEmpty()
  @IsISO8601()
  startTime: string;

  @ApiProperty({
    description: "Date et heure de fin (ISO8601)",
    example: "2025-07-15T11:00:00"
  })
  @IsNotEmpty()
  @IsISO8601()
  endTime: string;
}
