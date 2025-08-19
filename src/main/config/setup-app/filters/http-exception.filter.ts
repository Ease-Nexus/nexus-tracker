import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { env } from '../../env';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private configService: ConfigService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    this.logger.error(`Exception: ${exception.message}, status: ${status}`);

    const error: object = {
      statusCode: status,
      name: exception.name,
      message: exception.message,
      timestamp: new Date().toISOString(),
    };

    const { nodeEnv, debug } = env;
    const isDevelopment = nodeEnv === 'development';

    if (isDevelopment && debug) {
      Object.assign(error, { stack: exception.stack });
    }

    response.status(status).json(error);
  }
}
