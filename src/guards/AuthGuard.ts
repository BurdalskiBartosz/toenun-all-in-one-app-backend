import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/Public';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private db: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const cookies = request.cookies;
    const sessionToken = cookies['authjs.session-token'];
    if (!sessionToken) {
      return false;
    }

    const { userId } = await this.db.session.findUnique({
      where: {
        sessionToken,
      },
    });

    request['userId'] = userId;

    return true;
  }
}
