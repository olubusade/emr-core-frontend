import { Permission } from "./permission.interface";

export interface PermissionGroup {
  groupName: string;
  permissions: Permission[];
}