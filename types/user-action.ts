/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from '@nestjs/common';

export interface UserAction {
  ip: string;
  action: string;
  body: object;
  params: object;
  query: object;
  response: object;
}

export type UserActionHandler = (
  userAction: UserAction,
  logger: Logger,
) => Promise<void>;
export type UserActionErrorHandler = (
  error: unknown,
  logger: Logger,
) => Promise<void>;
export type UserActionFinallyHandler = (logger: Logger) => Promise<void>;

export interface UserActionOptionsCapture {
  ip?: boolean;
  body?: boolean;
  params?: boolean;
  query?: boolean;
  response?: boolean;
}

export interface UserActionOptions {
  capture?: UserActionOptionsCapture;
}

export interface UserActionContext {
  action: string;
}
