import { IVital } from "../interfaces/vital.interface";


export class Vital implements IVital {
  id: string;
  patientId: string;
  appointmentId: string;
  nurseId: string;
  readingAt: Date;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  spo2: number;
  weightKg: number;
  heightCm: number;
  bmi: number;
  painScale: number;
  notes: string;
  
  patient: any;
  nurse: any;

  constructor(vital: IVital) {
    this.id = vital.id || '';
    this.patientId = vital.patientId;
    this.appointmentId = vital.appointmentId;
    this.readingAt = new Date(vital.readingAt);
    this.weightKg = vital.weightKg;
    this.heightCm = vital.heightCm;
    this.bmi = vital.bmi;
    this.bloodPressure = vital.bloodPressure || '';
  }
}