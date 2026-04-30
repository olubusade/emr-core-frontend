// src/app/shared/service/dialog.service.ts

import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// Assuming this is your generic confirmation component in shared/components/dialogs
import { ConfirmDialogComponent } from '../components/dialogs/confirm-dialog/confirm-dialog.component'; 

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {}

  /**
   * 🔑 Method 1: Opens a complex, content-driven modal (e.g., a form).
   * @param config Configuration object including the component, data, and title.
   * @returns MatDialogRef<T, R> for handling close events and passing data back.
   */
  openModal<T, R = any>(config: { 
    component: Type<T>; 
    data?: any; 
    title: string; 
    width?: string;
  }): MatDialogRef<T, R> {
      
    // The component used here should typically be a generic wrapper if needed, 
    // or the MatDialog container loads the feature component directly.
    const dialogRef = this.dialog.open(config.component, {
        width: config.width || '600px',
        data: {
            ...config.data,
            dialogTitle: config.title // Pass the desired title into the component data
        },
        disableClose: true, // Prevents closing without intentional action
    });

    return dialogRef;
  }


  /**
   * 🔑 Method 2: Opens a simple confirmation dialog.
   * Uses a dedicated generic component from the shared module.
   * @param title The title of the confirmation box.
   * @param message The confirmation question (e.g., "Are you sure you want to delete?").
   * @returns Observable<boolean> that emits true if confirmed.
   */
  openConfirm(title: string, message: string): MatDialogRef<ConfirmDialogComponent, boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title, message }
    });
    
    // The dialog returns true/false based on button click
    return dialogRef as MatDialogRef<ConfirmDialogComponent, boolean>;
  }

  // Helper method to subscribe to only the confirmed result of the ConfirmDialog
  confirm(title: string, message: string): Observable<boolean> {
      return this.openConfirm(title, message).afterClosed().pipe(
          filter((result): result is boolean => result === true)
      );
  }
}