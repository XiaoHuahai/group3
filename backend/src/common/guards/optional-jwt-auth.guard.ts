import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // 重写 canActivate 方法，使没有 token 时也能通过
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 尝试激活，如果失败（没有 token 或 token 无效），返回 true 允许继续
    const result = super.canActivate(context);
    if (result instanceof Promise) {
      return result.catch(() => true);
    }
    if (result instanceof Observable) {
      return result.pipe(catchError(() => of(true)));
    }
    return result;
  }

  // 重写 handleRequest 方法，使认证失败时不抛出错误
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // 如果有错误或没有用户，返回 undefined 而不是抛出错误
    // 这样未认证的用户可以继续访问，但 req.user 会是 undefined
    if (err || !user) {
      return undefined;
    }
    return user;
  }
}

