import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './Auth/auth.module';
import { PrismaService } from './prisma.service';
import { AuthMiddleware } from './middleware/Auth';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/AuthGuard';
import { NotesModule } from './App/modules/NotesModule';

@Module({
  imports: [AuthModule, NotesModule],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('auth');
  }
}
