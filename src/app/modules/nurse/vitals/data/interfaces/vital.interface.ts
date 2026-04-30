export interface IVital {
  id?: string;
  patientId: string;
  appointmentId: string;
  nurseId?: string;
  readingAt: string | Date;

  // Clinical Metrics
  temperature?: number;
  bloodPressure?: string; // "120/80"
  heartRate?: number;
  respiratoryRate?: number;
  spo2?: number;

  weightKg: number;
  heightCm: number;
  bmi?: number;

  painScale?: number;
  notes?: string;

  editable?: boolean;
  viewOnly?: boolean;

  source?: 'NURSE' | 'DEVICE' | 'MANUAL';
  consciousnessLevel?: 'ALERT' | 'VERBAL' | 'PAIN' | 'UNRESPONSIVE';
  triageLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  temperatureUnit?: 'C' | 'F';
  heightUnit?: 'cm' | 'm' | 'ft';
  weightUnit?: 'kg' | 'lb';

  // Joined Data (for lists)
  patient?: {
    firstName: string;
    lastName: string;
    fullName?: string;
  };

  nurse?: {
    firstName: string;
    lastName: string;
    fullName?: string;
  };
}

export interface UnitOption {
  label: string;
  value: string;
}

export interface VitalUnitField {
  formControl: string;
  label: string;
  options: UnitOption[];
}

export type IVitalCreateDTO = Omit<IVital, 'id' | 'bmi' | 'editable' | 'viewOnly'>;
export type IVitalUpdateDTO = Partial<IVitalCreateDTO>;