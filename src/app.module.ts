import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PasswordModule } from './password/password.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UserModule, PasswordModule,],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
