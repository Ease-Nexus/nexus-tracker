import { Entity } from 'src/shared/domain/entity';

export interface BadgeProps {
  badgeValue: string;
  enabled: boolean;
  description: string;
}

export class Badge extends Entity<BadgeProps> {
  private constructor(props: BadgeProps, id?: string) {
    super(props, id);
  }

  get badgeValue(): string {
    return this.props.badgeValue;
  }
  get enabled(): boolean {
    return this.props.enabled;
  }
  get description(): string {
    return this.props.description;
  }

  static create(props: BadgeProps, id?: string) {
    return new Badge(props, id);
  }
}
