import { Controller, HttpStatus, HttpCode, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './auth.interface';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() authLoginDto: AuthLoginDto) {
        return this.authService.signIn(authLoginDto.email, authLoginDto.password);
    }
}
