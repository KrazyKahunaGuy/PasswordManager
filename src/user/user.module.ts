import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ConfigService]
})
export class UserModule { }
