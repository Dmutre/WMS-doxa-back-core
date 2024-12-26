import { SetMetadata } from '@nestjs/common';

export const UserAction = (action: string) =>
  SetMetadata('userAction', { action });
