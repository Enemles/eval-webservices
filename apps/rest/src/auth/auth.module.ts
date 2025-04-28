import { AuthModule as SharedAuthModule, JwtAuthGuard } from '@app/shared';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        SharedAuthModule
    ],
    controllers: [
        AuthController
    ],
    providers: [],
    exports: []
})
export class AuthModule { } 