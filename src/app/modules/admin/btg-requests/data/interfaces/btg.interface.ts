export interface BtgRequest {
  id?: string;
  patientId: string;
  reason: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
  durationMinutes?: number;
  requestedBy?: string;
  approvedBy?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BtgCountdown {
  btgRequestId: string;
  patientId: string;
  expiresAt: Date;
  remainingMs: number;
  remainingSeconds: number;
  isExpired: boolean;
  level: 'safe' | 'warning' | 'critical';
}


export interface BTGViewer {
  userId: string;
  name: string;
  role: 'doctor' | 'nurse' | string;
  accessedAt: string;
  lastSeenAt: string;
}

export interface BtgSession {
  id: string;
  patientId: string;
  userId: string;
  btgRequestId: string;
  startTime: string;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED';
}