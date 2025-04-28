import { Public } from '@app/shared/auth/public.decorator';
import { AuthService } from '@app/shared/services/auth/auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('login')
    public async login(@Body() data: any) {
        return await this.authService.login(data);
    }

    @Public()
    @Post('register')
    async register(@Body() data: any) {
        return await this.authService.register(data);
    }
} 