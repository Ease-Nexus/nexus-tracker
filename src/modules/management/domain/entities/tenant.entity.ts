import { Entity } from 'src/shared/domain';

export interface TenantProps {
  code: string;
  name: string;
  description?: string;
  contactInfo?: string;
  createdAt: Date;
}

export class Tenant extends Entity<TenantProps> {
  private constructor(props: TenantProps, id?: string) {
    super(props, id);
  }

  get code(): string {
    return this.props.code;
  }
  get name(): string {
    return this.props.name;
  }
  get description(): string | undefined {
    return this.props.description;
  }
  get contactInfo(): string | undefined {
    return this.props.contactInfo;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(props: TenantProps, id?: string) {
    return new Tenant(props, id);
  }
}
