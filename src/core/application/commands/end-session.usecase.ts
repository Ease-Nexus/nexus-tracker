import { Injectable } from '@nestjs/common';
import { DrizzleSessionRepository } from 'src/shared';

@Injectable()
export class EndSessionUsecase {
  constructor(private readonly sessionRepository: DrizzleSessionRepository) {}

  async end(sessionId: string) {
    const session = await this.sessionRepository.getById(sessionId);

    if (!session) {
      throw new Error('Session not foundd');
    }

    session.end();

    await this.sessionRepository.update(session);
  }
}
