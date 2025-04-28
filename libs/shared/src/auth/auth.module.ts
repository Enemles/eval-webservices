import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { AuthService } from '../services/auth/auth.service';
import { GqlAuthGuard } from './graphql-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [
        AuthService,
        GqlAuthGuard,
        JwtAuthGuard
    ],
    exports: [
        AuthService,
        GqlAuthGuard,
        JwtAuthGuard
    ]
})
export class AuthModule { } 