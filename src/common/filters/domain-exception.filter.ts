import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../domain/domain-error';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.statusCode;

    const body: ApiResponse = {
      success: false,
      statusCode,
      message: exception.message,
      data: null,
      error: exception.code,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }
}
