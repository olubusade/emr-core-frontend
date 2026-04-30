export class Bill {
  id!: string;
  patientId!: string;
  appointmentId: string;
  appointment?: any;
  amount!: number;
  status!: 'unpaid' | 'pending' | 'partially_paid' | 'paid' | 'cancelled';
  createdBy!: string;
  dueDate?: Date;
  paymentMethod?: 'cash' | 'card' | 'insurance' | 'transfer';
  notes?: string;
  reason?: string;
  
  // From includes
  patient?: { id: string; fullName: string; phone?: string };
  staff?: { fullName: string };
  
  // The Rich Clinical/Financial Context
  details?: {
    appointmentId: string;
    reason: string;
    date: Date;
    diagnosis: string;
    visitTotal: number;
    visitPaid: number;
    visitBalance: number;
    visitStatus: string;
  };

  createdAt!: Date;
  updatedAt!: Date;

  private constructor(data: any) {
    Object.assign(this, data);
    
    // Ensure numbers are handled as numbers
    this.amount = parseFloat(data.amount || 0);
    
    // Date Conversions
    if (data.dueDate) this.dueDate = new Date(data.dueDate);
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);

    // Map Details safely
    if (data.details) {
      this.details = {
        ...data.details,
        visitTotal: parseFloat(data.details.visitTotal || 0),
        visitPaid: parseFloat(data.details.visitPaid || 0),
        visitBalance: parseFloat(data.details.visitBalance || 0),
        date: new Date(data.details.date)
      };
    }
  }

  static fromApi(data: any): Bill {
    return new Bill(data);
  }

  // --- Helpers ---

  get isOutstanding(): boolean {
    return ['unpaid', 'pending', 'partially_paid'].includes(this.status);
  }

  get isOverdue(): boolean {
    return this.isOutstanding && !!this.dueDate && this.dueDate < new Date();
  }

  get formattedAmount(): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(this.amount);
  }

  get patientFullName(): string {
    return this.patient?.fullName || 'Unknown Patient';
  }

  // 1. Convert DB status to Human-Readable Text
  get statusLabel(): string {
    if (!this.status) return 'Unknown';
    
    // Replace underscores with spaces and title case it
    return this.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // 2. Centralized Color Logic for Badges
  get statusColor(): string {
    const colorMap = {
      paid: 'success',           // Green
      partially_paid: 'warning',  // Orange/Yellow
      pending: 'info',            // Blue
      unpaid: 'danger',           // Red
      cancelled: 'secondary'      // Gray
    };
    return colorMap[this.status] || 'primary';
  }

  // 3. Status specific checks (Useful for UI logic)
  get isPartiallyPaid(): boolean {
    return this.status === 'partially_paid';
  }
}