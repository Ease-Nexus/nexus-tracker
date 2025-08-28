import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ZodError, ZodObject } from 'zod';

interface ZodValidationInterceptorParams {
  headerSchema?: ZodObject<any>;
  bodySchema?: ZodObject<any>;
  querySchema?: ZodObject<any>;
  paramsSchema?: ZodObject<any>;
}

export class ZodValidationInterceptor implements NestInterceptor {
  constructor(private params: ZodValidationInterceptorParams) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    try {
      const { headerSchema, bodySchema, querySchema, paramsSchema } =
        this.params;
      const request: Request = context.switchToHttp().getRequest();

      if (headerSchema) {
        headerSchema.parse(request.headers);
      }

      if (paramsSchema) {
        paramsSchema.parse(request.params);
      }

      if (querySchema) {
        querySchema.parse(request.query);
      }

      if (bodySchema) {
        bodySchema.parse(request.body);
      }

      return next.handle();
    } catch (error) {
      const zodError = error as ZodError;

      console.log({ zodError });
      throw new BadRequestException(`validation(s) failed.`, {
        cause: zodError.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
  }
}
