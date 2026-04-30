import { MonthlyTrend } from "./monthly-trend.interface";

export interface IMetricsDataResponse {
  // --- Existing Admin/SuperAdmin Fields ---
  patientCount: number;
  userCount: number;
  revenue: number;
  revenuePending: number;
  totalAppointments: number;
  pendingBTGCount: number;
  activeBTGSessionCount: number;
  approvedBTGCount: number;
  rejectedBTGCount: number;
  monthlyPatientTrend: MonthlyTrend[];
  prometheusMetrics: string; 

  // --- 🏥 NEW: Doctor & Nurse Clinical Extension ---
  clinical?: {
    widgets: {
      todayPatients: number;
      pendingAppointments: number;
      todaysOperations: number;
      onlineConsultations: number;
      growthRates: {
        patients: number;
        appointments: number;
        operations: number;
        online: number;
      };
    };
    charts: {
      patientSurvey: {
        newPatients: number[];
        recovered: number[];
        labels: string[]; // e.g., ["Mon", "Tue", ...]
      };
      appointmentReview: {
        series: number[]; // e.g., [44, 55, 67]
        labels: string[]; // ["Face to Face", "E-Consult", "Available"]
      };
    };
    todaysAppointments: Array<{
      patientId: string;
      patient: {
        firstName: string;
        lastName: string;
        gender: string;
        profileImage: string;
      };
      chiefComplaint: string;
      tagClass: string; // e.g., 'col-red' for fever
      updatedAt: string;
    }>;
    patientGroups: Array<{
      name: string;
      count: number;
      colorClass: string;
    }>;
  };
}