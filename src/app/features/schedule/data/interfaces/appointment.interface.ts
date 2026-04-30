// 1. The structure returned by the API (READ/RESPONSE)

import { Appointment } from "../models/appointment.model";

export type TimeFrameType = 'PAST' | 'UPCOMING' | 'TODAY' | 'ALL';

export type Status =
  | 'scheduled'
  | 'checked_in'
  | 'awaiting_vitals'
  | 'vitals_taken'
  | 'in_consultation'
  | 'completed'
  | 'canceled';

export type ApptType = 'consultation' | 'follow_up' | 'emergency' | 'admission'| 'procedure';
export interface IApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
export interface IAppointmentResponse {
    id: string;
    patientId: string; // Foreign key UUID
    staffId: string;   // Foreign key UUID (Doctor/Clinician)
    appointmentDate: string;
    appointmentTime: string;
    reason?: string;
    type?: ApptType; 
    status: Status;
    createdAt: string;
    updatedAt: string;
    // Optional: Add related entities if joined by the backend service
    patient?: { firstName: string; lastName: string };
    staff?: { firstName: string; lastName: string };
}

// 2. DTO for creating a new Appointment (CREATE/REQUEST)
export interface IAppointmentCreateDTO {
    patientId: string;
    staffId: string;
    appointmentDate: string; // ISO 8601 string
    appointmentTime: string;
    reason?: string;
    notes?: string;
    type?: ApptType;
}

// 3. DTO for updating an existing Appointment (UPDATE/REQUEST)
// Allows updating date, reason, or status
export interface IAppointmentUpdateDTO {
    appointmentDate?: string;
    appointmentTime: string;
    reason?: string;
    notes?: string;
    type?: ApptType;
    status?: Status;
    staffId?: string;
}

// Utility interface for paginated list response from the API
export interface IAppointmentListResponse {
    items: IAppointmentResponse[];
    page: number;
    pages: number;
    total: number;
}

export interface BaseAppointmentListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  staffId?: string;
  status?: Status;
  timeFrame?: TimeFrameType
}

// Add this to your types file
export interface IAppointmentListModel {
    items: Appointment[]; // 👈 Changed from IAppointmentResponse[] to the Class
    page: number;
    pages: number;
    pageSize: number;
    total: number;
}