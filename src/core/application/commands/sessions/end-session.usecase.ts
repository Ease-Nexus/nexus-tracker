import { Injectable } from '@nestjs/common';
import { SessionsEndParams } from 'src/core/domain';
import { DrizzleSessionRepository } from 'src/shared';

@Injectable()
export class EndSessionUsecase {
  constructor(private readonly sessionRepository: DrizzleSessionRepository) {}

  async end({ tenantCode, id }: SessionsEndParams) {
    const session = await this.sessionRepository.getById({
      tenantCode,
      id,
    });

    if (!session) {
      throw new Error('Session not foundd');
    }

    session.end();

    await this.sessionRepository.update(session);
  }
}
