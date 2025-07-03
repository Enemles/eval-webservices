import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomDto {
  @ApiProperty({
    description: 'Nom de la salle',
    example: 'Salle de réunion B',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Capacité de la salle',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @ApiProperty({
    description: 'Localisation de la salle',
    example: 'Bâtiment B - 2ème étage',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;
}
