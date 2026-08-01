import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T> | T
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T> | T> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode: number = response.statusCode;

    if (statusCode === 204) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        statusCode,
        message: this.getMessage(statusCode),
        data: data ?? null,
        error: null,
        timestamp: new Date().toISOString(),
      })),
    );
  }

  private getMessage(statusCode: number): string {
    const messages: Record<number, string> = {
      200: 'Operación exitosa',
      201: 'Recurso creado exitosamente',
      202: 'Solicitud aceptada',
      204: 'Recurso eliminado exitosamente',
    };
    return messages[statusCode] ?? 'Solicitud procesada';
  }
}
