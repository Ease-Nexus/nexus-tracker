import { Entity } from 'src/shared/domain';
import { Tenant } from './tenant.entity';

export interface CustomerProps {
  tenantId: string;
  tenant?: Tenant;
  fullName: string;
  securityNumber: string;
  groupId: string;
  fixedBadgeId?: string;
  createdAt: Date;
}

export class Customer extends Entity<CustomerProps> {
  constructor(props: CustomerProps, id?: string) {
    super(props, id);
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get tenant(): Tenant | undefined {
    return this.props.tenant;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get securityNumber(): string {
    return this.props.securityNumber;
  }

  get groupId(): string {
    return this.props.groupId;
  }

  get fixedBadgeId(): string | undefined {
    return this.props.fixedBadgeId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(props: CustomerProps, id?: string) {
    return new Customer(props, id);
  }
}
