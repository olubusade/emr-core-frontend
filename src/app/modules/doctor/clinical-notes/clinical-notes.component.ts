import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClinicalService } from './data/services/clinical-note.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-clinical-notes-history',
  templateUrl: './clinical-notes.component.html',
  styleUrls: ['./clinical-notes.component.sass']
})
export class ClinicalNotesComponent implements OnInit {
  @Input() patientId: string;
  @Output() onSelectNote = new EventEmitter<any>();
  
  history: any[] = [];
  loading = false;

  constructor(private clinicalService: ClinicalService,
    private snackBar: MatSnackBar
  ) {
    
   }

  ngOnInit(): void {
    
    if (this.patientId) this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    this.clinicalService.getNotesByPatient(this.patientId).subscribe({
      next: (res) => {
        this.history = res || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false 
        this.snackBar.open(err?.message || 'Error loading clinical note history', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}