import { Component, Input, OnInit } from '@angular/core';
import { VitalsService } from '../../nurse/nurses/data/services/vitals.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-vitals-sidebar',
  templateUrl: './vitals-sidebar.component.html',
  styleUrls: ['./vitals-sidebar.component.scss']
})
export class VitalsSidebarComponent implements OnInit {
  @Input() appointmentId: string;
  @Input() patientId: string;
  vitals: any = null;
  loading = true;

  constructor(private vitalsService: VitalsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.appointmentId) {
      this.loadVitals();
    }
  }

  loadVitals() {
    this.vitalsService.getVitalsByAppointment(this.appointmentId,this.patientId).subscribe({
      next: (res:any) => {
        this.vitals = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false 
        this.snackBar.open(err?.message || 'Error loading vital list', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}