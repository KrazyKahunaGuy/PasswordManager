import { ConfigService } from "@nestjs/config"

const configService: ConfigService = new ConfigService();

export const constants = {
    DATABASE_URL: configService.getOrThrow<string>('DATABASE_URL'),
    SALT_OR_ROUNDS: configService.getOrThrow<number>('SALT_OR_ROUNDS'),
    JWT_SECRET_KEY: configService.getOrThrow<string>('JWT_SECRET_KEY'),
    JWT_EXPIRATION_TIME: configService.getOrThrow<string>('JWT_EXPIRATION_TIME')
}