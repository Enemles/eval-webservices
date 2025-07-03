import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Nom de la salle',
    example: 'Salle de réunion A',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Capacité de la salle',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @ApiProperty({
    description: 'Localisation de la salle',
    example: 'Bâtiment A - 1er étage',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;
}
