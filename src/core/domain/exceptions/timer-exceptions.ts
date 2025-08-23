import { HttpException, HttpStatus } from '@nestjs/common';

export class TimerNotFoundException extends HttpException {
  constructor() {
    super('Timer not found', HttpStatus.NOT_FOUND);
  }
}

export class TimerAlreadyStartedException extends HttpException {
  constructor() {
    super('Timer already started', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class TimerAlreadyCompletedException extends HttpException {
  constructor() {
    super('Timer already completed', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class TimerNotRunningException extends HttpException {
  constructor() {
    super('Timer not running', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

export class NoActiveExecutionBlockException extends HttpException {
  constructor() {
    super('No active execution block found', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
