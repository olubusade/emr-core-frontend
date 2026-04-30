import { Bill } from "../models/bill.model";

export type CurrencyAmount = string;
export type Status = 'unpaid' | 'pending' | 'partially_paid' | 'paid' | 'cancelled';
export type PaymentMethodType = 'cash' | 'card' | 'insurance' | 'transfer';
export interface IBillResponse {
  id: string;
  patientId: string;
  appointmentId: string;
  amount: CurrencyAmount;
  status: Status;
  dueDate?: string;
  paymentMethod?: PaymentMethodType;
  notes?: string;
  reason?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  patient?: { firstName: string; lastName: string };
}

export interface IBillCreateDTO {
  patientId: string;
  appointmentId: string;
  amount: CurrencyAmount;
  dueDate?: string;
  createdBy: string;
  notes?: string;
  reason?: string;
}

export interface IBillUpdateDTO {
  amount?: CurrencyAmount;
    status?: Status;
  dueDate?: string;
  paymentMethod?: PaymentMethodType;
  notes?: string;
  reason?: string;
}

export interface IBillListResponse {
  status: string;
  message: string;
  data: any[]; // 👈 Changed from 'items' to 'data' to match your JSON
  meta: {      // 👈 Added to match your JSON
    total: number;
    page: number;
    pageSize: number;
    pages: number;
  };
}


export interface BaseBillListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  staffId?: string;
  status?: Status;
}

export interface IBillListModel {
    items: Bill[]; // 👈 Changed from IAppointmentResponse[] to the Class
    page: number;
  pages: number;
  pageSize?: number;
    total: number;
}