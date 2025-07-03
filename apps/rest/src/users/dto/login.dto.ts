import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: "Email de l'utilisateur",
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
