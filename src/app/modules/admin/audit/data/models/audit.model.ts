import { RoleLabels } from 'src/app/core/constants/role-labels';
import { IAudit } from '../interfaces/audit.interface';

export class Audit {
  id: string;
  userName: string;
  userEmail: string;
  action: string;
  role: string;
  details: any;
  entity: string;
  ipAddress: string;
  createdAt: Date;
  userAgent: string;
  userId: string;

  constructor(data: IAudit) {
    
  this.id = data.id;

  this.userName =
    data.user?.fullName ||
    'System';

  this.userEmail =
    data.user?.email
    '';
  this.userId = data.user?.id;
  this.userAgent = data.userAgent;
  this.role = data.user?.roles?.[0]?.name?.replace(/_/g, ' ') ?? 'N/A';

  this.action = data.action?.replace(/_/g, ' ');

  this.entity = data.entity;

    this.ipAddress = data.ipAddress;
    this.details = data.details;

  this.createdAt = new Date(data.createdAt);
}

  static fromApi(data: IAudit): Audit {
    return new Audit(data);
  }
  getRoleLabel(role: string): string {
    
    return RoleLabels?.[role as keyof typeof RoleLabels] || role;
  }
}