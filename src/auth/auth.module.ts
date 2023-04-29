import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { constants } from '../constants';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: constants.JWT_SECRET_KEY,
      })
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})

export class AuthModule { }