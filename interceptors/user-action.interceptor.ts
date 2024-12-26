/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import {
  UserAction,
  UserActionContext,
  UserActionOptions,
} from '../types/user-action';

@Injectable()
export abstract class UserActionInterceptor implements NestInterceptor {
  protected readonly logger = new Logger(UserActionInterceptor.name);

  @Inject(Reflector)
  protected readonly reflector: Reflector;

  constructor(private readonly options: UserActionOptions) {}

  async intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request: Request = ctx.switchToHttp().getRequest();

    const userActionCtx = this.reflector.get<UserActionContext>(
      'userAction',
      ctx.getHandler(),
    );

    if (!userActionCtx) return next.handle();

    const {
      ip: captureIp = true,
      body: captureBody = true,
      params: captureParams = true,
      query: captureQuery = true,
      response: captureResponse = true,
    } = this.options.capture ?? {};

    const { ip, body, params, query } = request;

    const userAction = {
      action: userActionCtx.action,
      ip: captureIp ? ip : undefined,
      body: captureBody ? body : undefined,
      params: captureParams ? params : undefined,
      query: captureQuery ? query : undefined,
      response: undefined,
    };

    await this.beforeAction(userAction);

    return next.handle().pipe(
      tap({
        next: async (response) => {
          userAction.response = captureResponse ? response : undefined;
          await this.afterAction(userAction);
          return response;
        },
        error: async (error) => {
          await this.onError(error);
          throw error;
        },
        finalize: async () => {
          await this.onFinally();
        },
      }),
    );
  }

  protected beforeAction(userAction: UserAction): Promise<void> {
    return;
  }

  protected afterAction(userAction: UserAction): Promise<void> {
    return;
  }

  protected onError(error: unknown): Promise<void> {
    return;
  }

  protected onFinally(): Promise<void> {
    return;
  }
}
