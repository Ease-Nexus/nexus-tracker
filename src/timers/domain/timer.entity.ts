import { Entity } from 'src/shared/domain/entity';
import { TimerStatus } from './timer-status.enum';

export interface TimerProps {
  badgeId: string;
  duration: number;
  remaining: number;
  status: TimerStatus;
  startedAt?: Date;
  endAt?: Date;
}

export class Timer extends Entity<TimerProps> {
  private constructor(props: TimerProps, id?: string) {
    super(props, id);
  }

  get badgeId(): string {
    return this.props.badgeId;
  }

  get duration(): number {
    return this.props.duration;
  }

  get remaining(): number {
    return this.props.remaining;
  }

  get status(): TimerStatus {
    return this.props.status;
  }

  get startedAt(): Date | undefined {
    return this.props.startedAt;
  }

  get endAt(): Date | undefined {
    return this.props.endAt;
  }

  start() {
    this.props.startedAt = new Date();
    this.props.endAt = new Date(
      this.props.startedAt.getTime() + this.duration * 1000 * 60,
    );
    this.props.status = 'RUNNING';
  }

  pause() {
    if (!this.endAt || this.status !== 'RUNNING' || this.isExpired()) {
      return;
    }

    this.props.remaining = !this.isExpired()
      ? this.endAt.getTime() - new Date().getTime()
      : 0;

    this.props.status = 'PAUSED';
  }

  cancel() {
    this.props.status = 'CANCELED';
  }

  isExpired() {
    if (!this.endAt) return false;

    return this.endAt.getTime() < new Date().getTime();
  }

  public static create(props: TimerProps, id?: string): Timer {
    return new Timer(props, id);
  }

  public static createNew(
    badgeId: string,
    duration: number,
    started?: boolean,
  ): Timer {
    const timer = this.create({
      badgeId,
      duration,
      remaining: 0,
      status: 'CREATED',
    });

    if (started) {
      timer.start();
    }

    return timer;
  }
}
