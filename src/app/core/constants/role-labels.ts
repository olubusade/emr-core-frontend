import { Role } from "../domain/enum/role.enum";

export const RoleLabels: Record<Role, string> = {
  [Role.SuperAdmin]: 'System Admin',
  [Role.Admin]: 'Hospital Admin',
  [Role.Doctor]: 'Physician',
  [Role.Nurse]: 'Nurse',
  [Role.Receptionist]: 'Front Desk',
  [Role.Patient]: 'Patient'
};