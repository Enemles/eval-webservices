import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { AuthService } from '../services/auth/auth.service';
import { GqlAuthGuard } from './graphql-auth.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [
        AuthService,
        GqlAuthGuard
    ],
    exports: [
        AuthService,
        GqlAuthGuard
    ]
})
export class AuthModule { } 