export interface IAuditUser {
  id: string;
  email: string;
  roles: Roles;
  fullName: string;
}

export interface Roles {
  name: string;
}
export interface IAudit {
  id: string;
  user: IAuditUser;
  action: string;
  entity: string;
  entityId: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  createdAt: string;
}

export interface IAuditParams {
  page?: number;
  pageSize?: number;
  entity?: string;
}

export interface IAuditResponse {
  status: string;
  message: string;
  data: any[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pages: number;
  };
}