import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BillService } from "../data/services/bill.service";
import { PatientService } from "src/app/features/patient-chart/data/services/patient.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-bill-form",
  templateUrl: "./bill-form.component.html",
  styleUrls: ["./bill-form.component.scss"],
})
export class BillFormComponent implements OnInit {
  billForm: FormGroup;
  isEdit = false;
  billId: string | null = null;
  isLoading = false;
  isReadOnly = false; // Can be used to lock the form based on bill status or user permissions
  patients: any[] = [];
  filteredQueue: any[] = [];

  pendingQueue: any[] = [];

  // Options exactly matching your Sequelize ENUMs
  statusOptions = [
    //{ value: 'unpaid', label: 'Unpaid' },
   
    //{ value: 'partially_paid', label: 'Partially Paid' },
    
    //{ value: 'cancelled', label: 'Cancelled' }
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' }
  ];

  paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'transfer', label: 'Bank Transfer' }
  ];
  maxAvailableBalance: number = 0;
  totalAmount: number = 0;
  selectedPatient: string;
  selectedBillId: string;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private billService: BillService,
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {
    this.billForm = this.fb.group({
      patientId: ["", Validators.required],
      appointmentId: ['', Validators.required], //hidden
      amount: [0.00, [Validators.required, Validators.min(1)]],
      status: ["unpaid", Validators.required],
      dueDate: ["", Validators.required],
      paymentMethod: [null],
      notes: [""]
    });
  }

  ngOnInit() {
    // Check for ID in URL
    this.billId = this.route.snapshot.paramMap.get("id");
    if (this.billId) {
      this.isEdit = true;
      if (this.isEdit) {
        this.billForm.get('patientId')?.disable();
      }
      this.fetchBillDetails();
    } else { 
          this.loadBillingQueue();
    }
    this.setupFormListeners();
  }

  /**
   * Centralized Balance Calculation
   * Logic: Total Appointment Cost - Amount Already Paid in previous bills
   */
  private calculateBalance(total: any, paid: any): number {
    const t = parseFloat(total) || 0;
    const p = parseFloat(paid) || 0;
    return Math.max(0, t - p);
  }
  getInvalidControls() {
    const invalid = [];
    const controls = this.billForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  loadBillingQueue() {
    this.isLoading = true;
    const params = { page: 1, limit: 100, search: '' };
    this.billService.getPendingBills(params).subscribe({
      next: (res: any) => {
        
        this.pendingQueue = res.items || [];
        
        this.filteredQueue = [...this.pendingQueue];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Error loading billing queue', 'Close', { duration: 3000 });
      }
    });
  }

// 1. Filtering logic for the search input inside the dropdown
filterPatients(event: any) {
  const val = event.target.value.toLowerCase();
  this.filteredQueue = this.pendingQueue.filter(app => {
    // We navigate the nested patient object from your JSON
    const fullName = `${app.patient?.firstName} ${app.patient?.lastName}`.toLowerCase();
    const phone = app.patient?.phone || '';
    return fullName.includes(val) || phone.includes(val);
  });
}

// 2. Selection logic to pre-fill the form
onSelectionChange(event: any) {
  const selectedApp = this.pendingQueue.find(app => app.patientId === event.value);
  if (selectedApp) {
    this.totalAmount = selectedApp.totalAmount;
    this.maxAvailableBalance = this.calculateBalance(selectedApp.totalAmount, selectedApp.amountPaid);
   
    this.billForm.patchValue({
      patientId: selectedApp.patient.id,
      appointmentId: selectedApp.id,
      amount: selectedApp.totalAmount,
      notes: selectedApp.reason == null ? 'General Consultation' : `Billing for ${selectedApp.reason}`,
      dueDate: new Date().toISOString().split('T')[0]
    });
  }
}

  setupFormListeners() {
    // Listen to the amount field
    this.billForm.get('amount')?.valueChanges.subscribe(value => {
      if (this.maxAvailableBalance > 0) {
        const inputAmount = parseFloat(value) || 0;

        // 1. Logic for Status Auto-Selection
        if (inputAmount >= this.maxAvailableBalance) {
          this.billForm.get('status')?.setValue('paid', { emitEvent: false });
        } else if (inputAmount > 0) {
          this.billForm.get('status')?.setValue('partially_paid', { emitEvent: false });
        } else {
          this.billForm.get('status')?.setValue('unpaid', { emitEvent: false });
        }

        // 2. Logic for Overpayment Validation
        if (inputAmount > this.maxAvailableBalance) {
          this.billForm.get('amount')?.setErrors({ exceedsBalance: true });
        }
      }
    });
  }

  
  fetchBillDetails() {
    this.isLoading = true;
    this.billService.getBill(this.billId!).subscribe({
      next: (resp:any) => {
        
        const bill = resp.data;
        // 1. Map the "fullName" into the structure the mat-option expects
      // This ensures the dropdown has a label to display for the ID
        if (bill.patient) {
          this.filteredQueue = [{
            patientId: bill.patientId,
            patient: {
              firstName: bill.patient.fullName, // Map fullName to firstName for the display logic
              lastName: '',
              id: bill.patient.id
            },
            diagnosis: bill.appointment?.clinicalNote?.diagnosis || 'N/A'
          }];
        }
        //Format the Due Date for the HTML5 date input (YYYY-MM-DD)
        let formattedDate = '';
        if (bill.dueDate) {
          // This takes "2026-04-14T..." and turns it into "2026-04-14"
          formattedDate = new Date(bill.dueDate).toISOString().split('T')[0];
        }

        this.totalAmount = bill.appointment?.totalAmount;
        // Calculate remaining balance based on the linked appointment
        this.maxAvailableBalance = this.calculateBalance(
          bill.appointment?.totalAmount, 
          bill.appointment?.amountPaid
        );
        //for invoice printing
        this.selectedPatient = bill.patient.fullName;
        this.selectedBillId = bill.id;
        // 1. Patch the values
        this.billForm.patchValue({
          patientId: bill.patientId, 
          appointmentId: bill.appointmentId,
          amount:  bill.appointment?.totalAmount,
          status: bill.status,
          paymentMethod: bill.paymentMethod,
          notes: bill.notes || 'General Consultation',
          dueDate: formattedDate 
        });

        // 2. Lock the patient selection regardless (standard audit rule)
        this.billForm.get('patientId')?.disable();
        // Disable amount and patient selection in edit mode
        this.billForm.get('amount')?.disable();

        // 3. Handle PAID status logic
        if (bill.status === 'paid') {
          this.isReadOnly = true;
          this.billForm.disable(); // 👈 This locks every field in the form
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        // One line to rule them all
        this.snackBar.open(err?.message, 'Close', { 
          duration: 5000,
          panelClass: ['error-snackbar'] 
        });
      }
    });
  }

/*   printInvoice() {
  const printContents = document.getElementById('print-section')?.innerHTML;
  const originalContents = document.body.innerHTML;

  if (!printContents) return;

  document.body.innerHTML = printContents;

  window.print();

  document.body.innerHTML = originalContents;

  window.location.reload(); // restore Angular bindings
  } */
  
  printInvoice() {
  const content = document.getElementById('print-section')?.innerHTML;

  const win = window.open('', '', 'width=800,height=600');

  if (win && content) {
    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  }
}

  onSubmit() {
    if (this.billForm.invalid) return;

    this.isLoading = true;
    const payload = this.billForm.getRawValue();
    if (this.isEdit) {
      delete payload.appointmentId;
      delete payload.patientId;  
    }
    payload.amount = parseFloat(payload.amount);
    const request$ = this.isEdit 
      ? this.billService.updateBill(this.billId!, payload)
      : this.billService.createBill(payload);

    request$.subscribe({
      next: () => {
        this.snackBar.open("Bill Generated Successfully", "Close", { duration: 3000 });
        this.router.navigate(["/billing/all"]);
      },
        error: (err) => {
        this.isLoading = false;
        // One line to rule them all
        this.snackBar.open(err?.message || 'check your input', 'Close', { 
          duration: 5000,
          panelClass: ['error-snackbar'] 
        });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/billing/all']);
  }
}