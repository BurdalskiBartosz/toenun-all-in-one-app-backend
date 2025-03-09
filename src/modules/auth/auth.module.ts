import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { AuthRepository } from './auth.repository';
import { AUTH_SERVICE } from './di-tokens';

@Module({
  controllers: [AuthController],
  providers: [
    { provide: AUTH_SERVICE, useClass: AuthService },
    PrismaService,
    AuthRepository,
  ],
})
export class AuthModule {}
