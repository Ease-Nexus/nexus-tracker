import { Entity } from 'src/shared/domain';

import { Logger } from '@nestjs/common';
import { Tenant } from './tenant.entity';
import { Session } from './session.entity';
import {
  TimerAlreadyStartedException,
  TimerAlreadyCompletedException,
  TimerNotRunningException,
  NoActiveExecutionBlockException,
} from '../exceptions';

export const timerStatuses = [
  'CREATED',
  'RUNNING',
  'PAUSED',
  'COMPLETED',
  'CANCELED',
] as const;

export type TimerStatus = (typeof timerStatuses)[number];

export interface TimerHistoryEntry {
  start: Date;
  end?: Date;
  elapsed: number;
}

export interface TimerProps {
  tenantId: string;
  tenant?: Tenant;
  sessionId: string;
  session?: Session;
  duration: number;
  elapsed: number;
  remaining?: number;
  status: TimerStatus;
  startedAt?: Date;
  lastStartedAt?: Date;
  history: TimerHistoryEntry[];
}

export class Timer extends Entity<TimerProps> {
  logger = new Logger(Timer.name);
  private constructor(props: TimerProps, id?: string) {
    super(props, id);
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get tenant(): Tenant | undefined {
    return this.props.tenant;
  }

  get sessionId(): string {
    return this.props.sessionId;
  }

  get session(): Session | undefined {
    return this.props.session;
  }

  get duration(): number {
    return this.props.duration;
  }

  get elapsed(): number {
    return this.props.elapsed;
  }

  get remaining(): number | undefined {
    return this.props.remaining;
  }

  get status(): TimerStatus {
    return this.props.status;
  }

  get startedAt(): Date | undefined {
    return this.props.startedAt;
  }

  get lastStartedAt(): Date | undefined {
    return this.props.lastStartedAt;
  }

  get history(): TimerHistoryEntry[] {
    return this.props.history;
  }

  private calculateTotalElapsed(): number {
    return this.props.history.reduce((acc, block) => {
      const blockElapsed =
        block.end && block.elapsed
          ? block.elapsed
          : Date.now() - block.start.getTime();
      return acc + blockElapsed;
    }, 0);
  }

  updateLive(now = new Date()) {
    let openBlock = 0;

    if (this.status === 'RUNNING' && this.lastStartedAt) {
      openBlock = now.getTime() - this.lastStartedAt.getTime();
    }

    const closedBlocks = this.history.reduce(
      (acc, block) => acc + (block.end ? block.elapsed : 0),
      0,
    );

    this.props.elapsed = closedBlocks + openBlock;
    this.props.remaining = this.duration - this.props.elapsed;

    return { liveElapsed: this.elapsed, remaining: this.props.remaining };
  }

  start() {
    if (this.status === 'RUNNING') {
      throw new TimerAlreadyStartedException();
    }

    if (this.status === 'COMPLETED') {
      throw new TimerAlreadyCompletedException();
    }

    const now = new Date();

    if (this.status === 'CREATED') {
      this.props.startedAt = now;
    }

    this.history.push({
      start: now,
      elapsed: 0,
    });
    this.props.lastStartedAt = now;
    this.props.status = 'RUNNING';
  }

  pause() {
    if (this.status !== 'RUNNING') {
      throw new TimerNotRunningException();
    }

    const now = new Date();
    const currentBlock = this.history[this.history.length - 1];

    if (!currentBlock) {
      throw new NoActiveExecutionBlockException();
    }

    currentBlock.end = now;
    currentBlock.elapsed = now.getTime() - currentBlock.start.getTime();

    this.props.elapsed = this.calculateTotalElapsed();
    this.props.lastStartedAt = undefined;
    this.props.status = 'PAUSED';
  }

  complete() {
    if (this.status === 'COMPLETED') {
      throw new TimerAlreadyCompletedException();
    }

    if (this.status === 'RUNNING') {
      this.endExecution();
    }

    this.props.elapsed = this.calculateTotalElapsed();
    this.props.status = 'COMPLETED';
  }

  private endExecution() {
    const now = new Date();
    const currentBlock = this.history[this.history.length - 1];

    if (currentBlock && !currentBlock.end) {
      currentBlock.end = now;
      currentBlock.elapsed = now.getTime() - currentBlock.start.getTime();
    }
  }

  isCompleted() {
    const { remaining } = this.updateLive();
    return remaining <= 0;
  }

  public static create(props: TimerProps, id?: string): Timer {
    return new Timer(props, id);
  }

  public static createNew(session: Session, durationMinutes: number): Timer {
    const timer = this.create({
      tenantId: session.tenantId,
      tenant: session.tenant,
      sessionId: session.id,
      session,
      duration: durationMinutes * 1000 * 60,
      elapsed: 0,
      status: 'CREATED',
      history: [],
    });

    return timer;
  }
}
