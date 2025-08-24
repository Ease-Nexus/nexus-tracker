import { Session } from './session.entity';
import { Tenant } from './tenant.entity';
import { Entity } from 'src/shared/domain';

export const badgeTypes = ['CARD', 'BRACELET', 'DIGITAL'] as const;

export type BadgeType = (typeof badgeTypes)[number];

export interface BadgeProps {
  tenantId: string;
  tenant?: Tenant;
  badgeValue: string;
  enabled: boolean;
  description: string;
  badgeType: BadgeType;
  isFixed: boolean;
  session?: Session;
}

export class Badge extends Entity<BadgeProps> {
  private constructor(props: BadgeProps, id?: string) {
    super(props, id);
  }
  get tenantId(): string {
    return this.props.tenantId;
  }
  get tenant(): Tenant | undefined {
    return this.props.tenant;
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
  get badgeType(): BadgeType {
    return this.props.badgeType;
  }
  get isFixed(): boolean {
    return this.props.isFixed;
  }
  get session(): Session | undefined {
    return this.props.session;
  }

  public inUse(): boolean {
    return !!this.props.session && !this.props.session.endedAt;
  }

  static create(props: BadgeProps, id?: string) {
    return new Badge(props, id);
  }
}
