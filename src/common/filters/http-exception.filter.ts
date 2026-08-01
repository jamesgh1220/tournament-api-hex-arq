import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      const body = exceptionResponse as Record<string, unknown>;
      message =
        ((Array.isArray(body.message)
          ? body.message[0]
          : body.message) as string) ?? exception.message;
    } else {
      message = exception.message;
    }

    const body: ApiResponse = {
      success: false,
      statusCode,
      message,
      data: null,
      error: exception.name,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }
}
