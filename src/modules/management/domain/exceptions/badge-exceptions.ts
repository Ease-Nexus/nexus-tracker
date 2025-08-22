import { HttpException, HttpStatus } from '@nestjs/common';

export class UnavailableBadgeException extends HttpException {
  constructor() {
    super('Badge already being used or reserved', HttpStatus.BAD_REQUEST);
  }
}

export class BadgeNotFoundException extends HttpException {
  constructor() {
    super('Badge not found', HttpStatus.NOT_FOUND);
  }
}
