import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IVital } from './data/interfaces/vital.interface';
import { VitalService } from './data/services/vital.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-vitals-list',
  templateUrl: './vitals.component.html',
  styleUrls: ['./vitals.component.sass']
})
export class VitalsComponent implements OnInit {
  @Input() patientId: string;
  @Output() onEdit = new EventEmitter<IVital>();
  
  vitalsHistory: IVital[] = [];
  loading = false;

  constructor(private vitalService: VitalService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.patientId) {
      this.loadHistory();
    }
  }


  loadHistory() {
    this.loading = true;
    this.vitalService.getVitalsByPatient(this.patientId).subscribe({
      next: (vital:any) => {
        this.vitalsHistory = vital.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false 
        this.snackBar.open(err?.message || 'Error loading staff list', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  editRecord(vital: IVital) {
    this.onEdit.emit(vital); // Send the record back to the form parent
  }
}