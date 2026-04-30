export class Patient {
  id: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  dob: string = '';                    // "YYYY-MM-DD"
  gender: string = 'unknown';
  maritalStatus: string | null = null;
  bloodGroup: string | null = null;
  genotype: string | null = null;
  nationality: string | null = null;
  status: string = 'active';
  createdAt: string = '';
  updatedAt: string = '';

  constructor(data: Partial<Patient> = {}) {
    Object.assign(this, data);
  }

  get fullName(): string {
    return [this.firstName?.trim(), this.lastName?.trim()]
      .filter(Boolean)
      .join(' ') || 'Unknown Patient';
  }

  get age(): number | null {
    if (!this.dob) return null;
    const birth = new Date(this.dob);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : null;
  }

  get displayDob(): string {
    return this.dob ? new Date(this.dob).toLocaleDateString('en-GB') : '—';
  }

  get displayStatus(): string {
    return this.status ? this.status.charAt(0).toUpperCase() + this.status.slice(1) : '—';
  }
}