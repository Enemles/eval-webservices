import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: "Nom d'utilisateur", required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: "Identifiant Keycloak", required: false })
  @IsOptional()
  @IsString()
  keycloak_id?: string;

  @ApiProperty({ description: "Email de l'utilisateur", required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Prénom de l'utilisateur", required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: "Nom de famille de l'utilisateur", required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: "Mot de passe", required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}
