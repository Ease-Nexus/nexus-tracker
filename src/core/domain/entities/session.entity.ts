import { Entity } from 'src/shared/domain';
import { Tenant } from './tenant.entity';
import { Badge } from './badge.entity';
import { Customer } from './customer.entity';

export interface SessionProps {
  tenantCode: string;
  tenant?: Tenant;
  customerId?: string;
  customer?: Customer;
  badgeId: string;
  badge?: Badge;
  startedAt?: Date;
  endedAt?: Date;
}
export class Session extends Entity<SessionProps> {
  constructor(props: SessionProps, id?: string) {
    super(props, id);
  }

  get tenantCode(): string {
    return this.props.tenantCode;
  }

  get tenant(): Tenant | undefined {
    return this.props.tenant;
  }

  get customerId(): string | undefined {
    return this.props.customerId;
  }

  get customer(): Customer | undefined {
    return this.props.customer;
  }

  get badgeId(): string {
    return this.props.badgeId;
  }

  get badge(): Badge | undefined {
    return this.props.badge;
  }

  get startedAt(): Date | undefined {
    return this.props.startedAt;
  }

  get endedAt(): Date | undefined {
    return this.props.endedAt;
  }

  end() {
    this.props.endedAt = new Date();
  }

  static create(props: SessionProps, id?: string): Session {
    return new Session(props, id);
  }
}
