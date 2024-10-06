import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (metadata: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const userId = request['userId'];
    if (!userId) {
      throw new UnauthorizedException('Invalid userId');
    }

    return userId;
  },
);
