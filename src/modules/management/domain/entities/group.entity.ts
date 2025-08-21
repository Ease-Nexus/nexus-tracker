import { Entity } from 'src/shared/domain';

export interface GroupsProps {
  tenantId: string;
  name: string;
  description: string;
  balance: number;
  version: number;
  enabled: boolean;
  createdAt: Date;
}

export class Group extends Entity<GroupsProps> {
  private constructor(props: GroupsProps, id?: string) {
    super(props, id);
  }

  get tenantId(): string {
    return this.props.tenantId;
  }
  get name(): string {
    return this.props.name;
  }
  get description(): string {
    return this.props.description;
  }
  get balance(): number {
    return this.props.balance;
  }
  get version(): number {
    return this.props.version;
  }
  get enabled(): boolean {
    return this.props.enabled;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(props: GroupsProps, id?: string) {
    return new Group(props, id);
  }
}
