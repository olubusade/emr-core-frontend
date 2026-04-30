// src/app/shared/services/user-action.service.ts

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/core/service/toast.service';
import { UserPermissionManagerDialogComponent } from 'src/app/shared/components/dialogs/user-permission-manager-dialog/user-permission-manager-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class UserActionService {

  constructor(
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  /**
   * Opens the shared permission management dialog for any user role.
   * @param user The user object (Doctor, Nurse, etc.) containing id and name.
   */
  manageUserPermissions(user: { id: string, name: string }): void {
    const dialogRef = this.dialog.open(UserPermissionManagerDialogComponent, {
      width: '750px', 
      data: {
        userId: user.id,
        userName: user.name,
      },
    });

    // Handle the result only once, here in the service
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.permissionsUpdated) {
        this.toastService.success(`Permissions for ${user.name} updated successfully.`, 'Success');
      }
    });
  }
}