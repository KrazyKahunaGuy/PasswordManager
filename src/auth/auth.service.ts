import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../jwt/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private jwtService: JwtService,
    ) { }

    async signIn(email: string, plaintextPassword: string): Promise<any> {
        const secretOrPrivateKey = this.configService.getOrThrow<string>('JWT_SECRET_KEY') || 'jwt_secret_key'
        const user = await this.userService.findOne({ email: email });
        if (user) {
            if (await this.userService.checkPassword(plaintextPassword, user.password)) {
                throw new UnauthorizedException();
            }
            const payload: JwtPayload = {
                userId: user.id,
                email: user.email,
                role: 'user',
                iat: new Date().getTime(),
                exp: +(new Date().getTime() + this.configService.getOrThrow<number>('JWT_EXPIRATION_TIME'))
            };
            return {
                access_token: await this.jwtService.signAsync(payload, { secret: secretOrPrivateKey}),
            }
        }
        throw new NotFoundException();
    }
}
