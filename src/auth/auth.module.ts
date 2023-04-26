import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';


@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    ConfigService,
    JwtService,
    PrismaService,
  ]
})
export class AuthModule { }
