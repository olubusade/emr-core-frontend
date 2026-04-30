// role.interface.ts

// Assuming these are defined elsewhere, but included for context:
export interface IPermissionResponse {
  key: string;      // e.g., 'PATIENT_READ'
  name: string;
  description?: string;
}

export interface IRoleResponse {
  id: string; // Assuming UUID
  key: string; // e.g., 'ADMIN'
  name: string; // e.g., 'Administrator'
  description?: string;
}

// DTOs for Requests
export interface IRoleCreateDTO {
    key: string;
    name: string;
    description?: string;
}

export interface IPermissionCreateDTO {
    key: string;
    name: string;
    description?: string;
}

// DTO for updating permissions on a role/user
export interface IPermissionKeysDTO {
    permissionKeys: string[];
}

// DTO for updating roles on a user
export interface IRoleKeysDTO {
    roleKeys: string[];
}