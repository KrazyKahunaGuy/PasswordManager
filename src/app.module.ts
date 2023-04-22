import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PasswordModule } from './password/password.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    UserModule,
    PasswordModule,
    AuthModule,
    ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env`})
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService
  ],
})
export class AppModule { }
