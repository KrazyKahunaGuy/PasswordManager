import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../jwt/jwt-payload.interface';
import { constants } from '../constants';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async signIn(email: string, plaintextPassword: string): Promise<any> {
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
                exp: Math.floor(((new Date().getTime() + Number(constants.JWT_EXPIRATION_TIME)))),
            };

            return {
                access_token: await this.jwtService.signAsync(payload),
            }
        }

        throw new NotFoundException();
    }
}
