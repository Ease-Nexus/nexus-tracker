import { HttpException, HttpStatus } from '@nestjs/common';

export class TenantNotFoundException extends HttpException {
  constructor() {
    super('Tenant not found', HttpStatus.NOT_FOUND);
  }
}
