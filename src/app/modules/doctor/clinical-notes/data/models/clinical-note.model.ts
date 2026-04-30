import { IClinicalNote } from "../interfaces/clinical-note.interface";


export class ClinicalNote implements IClinicalNote {
  id?: string;
  patientId: string;
  staffId: string;
  appointmentId: string;
  diagnosis: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;

  constructor(note: any) {
    this.id = note.id;
    this.patientId = note.patientId;
    this.staffId = note.staffId;
    this.appointmentId = note.appointmentId;
    this.diagnosis = note.diagnosis || '';
    this.subjective = note.subjective || '';
    this.objective = note.objective || '';
    this.assessment = note.assessment || '';
    this.plan = note.plan || '';
  }

  // Helper to format the display of the diagnosis
  get displayDiagnosis(): string {
    return this.diagnosis ? this.diagnosis : 'No Diagnosis Recorded';
  }
}