import { Entity } from 'src/shared/domain/entity';
import { TimerStatus } from './timer-status.enum';
import { BadRequestException, Logger } from '@nestjs/common';
import { Badge } from './badge.entity';

export interface TimerHistoryEntry {
  start: Date;
  end?: Date;
  elapsed: number;
}

export interface TimerProps {
  badgeId: string;
  badge: Badge;
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

  get badgeId(): string {
    return this.props.badgeId;
  }

  get badge(): Badge {
    return this.props.badge;
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
      throw new BadRequestException('Timer is already running');
    }

    if (this.status === 'COMPLETED') {
      throw new BadRequestException('Timer is already completed');
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
      throw new BadRequestException('Timer is not running');
    }

    const now = new Date();
    const currentBlock = this.history[this.history.length - 1];

    if (!currentBlock) {
      throw new BadRequestException('No active blocks found');
    }

    currentBlock.end = now;
    currentBlock.elapsed = now.getTime() - currentBlock.start.getTime();

    this.props.elapsed = this.calculateTotalElapsed();
    this.props.lastStartedAt = undefined;
    this.props.status = 'PAUSED';
  }

  complete() {
    if (this.status === 'COMPLETED') {
      throw new BadRequestException('Timer is already completed');
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

  public static createNew(badge: Badge, durationMinutes: number): Timer {
    const timer = this.create({
      badgeId: badge.id,
      badge,
      duration: durationMinutes * 1000 * 60,
      elapsed: 0,
      status: 'CREATED',
      history: [],
    });

    return timer;
  }
}
