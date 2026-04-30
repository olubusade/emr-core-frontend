import { Role } from "../enum/role.enum";

export interface User {
  id: string;
  fName: string;
  lName: string;
  fullName: string;
  designation: string;
  email: string;
  phone?: string;
  roles: Role[] | string[]; //allows multiple roles per user
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

