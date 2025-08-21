import { Entity } from 'src/shared/domain';
import { Tenant } from './tenant.entity';
import { Group } from './group.entity';

export const transactionTypes = ['CREDIT', 'DEBIT'] as const;

export type TransactionType = (typeof transactionTypes)[number];

export interface TransactionProps {
  tenantId: string;
  tenant?: Tenant;
  groupId: string;
  group?: Group;
  minutesChange: number;
  transactionType: TransactionType;
  createdAt: Date;
}

export class Transaction extends Entity<TransactionProps> {
  constructor(props: TransactionProps, id?: string) {
    super(props, id);
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get tenant(): Tenant | undefined {
    return this.props.tenant;
  }

  get groupId(): string {
    return this.props.groupId;
  }

  get group(): Group | undefined {
    return this.props.group;
  }

  get minutesChange(): number {
    return this.props.minutesChange;
  }

  get transactionType(): TransactionType {
    return this.props.transactionType;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(props: TransactionProps, id?: string) {
    return new Transaction(props, id);
  }
}
