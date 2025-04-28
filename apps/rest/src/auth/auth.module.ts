import { UserEntity } from '@app/shared/entities/user.entity';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity])
    ],
    controllers: [
        AuthController
    ],
    providers: [
        JwtAuthGuard,
        AuthService
    ],
    exports: [
        JwtAuthGuard
    ]
})
export class AuthModule { } 