import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-express';

@Injectable()
export class Guest implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    if (ctx.getContext().user) {
      throw new ForbiddenError('Already authenticated!');
    }
    return true;
  }
}
