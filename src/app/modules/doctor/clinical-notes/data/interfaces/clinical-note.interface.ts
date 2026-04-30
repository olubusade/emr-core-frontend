export interface IClinicalNote {
  id?: string;
  patientId: string;
  staffId: string;
  appointmentId: string;
  
  // SOAP Fields
  diagnosis?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  
  // Metadata
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}