import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    console.log('=== ДЕКОРАТОР ВЫЗВАН ===');
    console.log('Данные в request.user:', request.user);
    console.log('Что искали (data):', data);

    return data ? user?.[data] : user;
  },
);
