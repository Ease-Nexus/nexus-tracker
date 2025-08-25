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
import { ApiProperty } from '@nestjs/swagger';

export class ExceptionResponseDto {
  @ApiProperty() statusCode: number;
  @ApiProperty() message: string;
  @ApiProperty() name: string;
  @ApiProperty() timestamp: string;
  @ApiProperty() stack?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private configService: ConfigService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    this.logger.error(`Exception: ${exception.message}, status: ${status}`);

    const error: ExceptionResponseDto = {
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
