/**
 * Error de dominio base.
 * El statusCode es un código HTTP numérico neutro (sin dependencia de NestJS)
 * para que la capa de infraestructura lo traduzca en el filter global.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
