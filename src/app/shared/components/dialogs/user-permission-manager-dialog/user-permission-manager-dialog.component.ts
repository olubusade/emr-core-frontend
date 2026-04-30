// src/app/shared/dialogs/user-permission-manager-dialog/user-permission-manager-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

import { ToastService } from 'src/app/core/service/toast.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { RoleManagerService } from 'src/app/modules/admin/role-and-permission-management/data/services/role-manager.service';
import { PermissionGroup } from 'src/app/core/domain/interfaces/permission-group.interface';
import { Permission } from 'src/app/core/domain/interfaces/permission.interface';

// Define the data received by the dialog
interface DialogData {
  userId: string;
  userName: string;
}

@Component({
  selector: 'app-user-permission-manager-dialog',
  templateUrl: './user-permission-manager-dialog.component.html',
  styleUrls: ['./user-permission-manager-dialog.component.scss']
})
export class UserPermissionManagerDialogComponent implements OnInit {

  // State variables
  permissionGroups: PermissionGroup[] = [];
  allPermissions: Permission[] = [];
  
  // Set to track permissions assigned to this specific user
  assignedPermissionKeys: Set<string> = new Set(); 
  
  isLoading: boolean = true;
  isSaving: boolean = false;
  
  // Permission key required to update user permissions
  updatePermissionKey = 'USER_PERMISSION_UPDATE';

  constructor(
    public dialogRef: MatDialogRef<UserPermissionManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private roleManagerService: RoleManagerService,
    private toastService: ToastService,
    public authService: AuthService // For permission checks
  ) {}

  ngOnInit(): void {
    if (this.authService.hasPermission(this.updatePermissionKey)) {
        this.loadAllPermissions();
        this.loadUserPermissions();
    } else {
        this.toastService.error('You do not have permission to manage user access.', 'Access Denied');
        this.dialogRef.close();
    }
  }
  
  // --- Data Loading ---

   loadAllPermissions(): void {
    // NOTE: If the API returns a complex object { data: [...] } instead of an array, this handles it.
    this.roleManagerService.getAllPermissions().subscribe({
      next: (response: any) => {
        // Ensure we get an array, assuming the API might return { data: [/* permissions */] }
        const permissions = Array.isArray(response) ? response : response.data || [];
        
        if (permissions.length === 0) {
            this.toastService.warning('Master permission list is empty.', 'No Data');
            this.isLoading = false;
            return;
        }

        this.allPermissions = permissions;
        // 🔑 FIX: Run the grouping and update the template's source array
        this.permissionGroups = this.groupPermissions(permissions); 
        
        // Note: isLoading is handled when loadUserPermissions completes
      },
      error: (err) => {
        this.toastService.error(err?.message || 'Failed to load master permission list.', 'API Error');
        this.isLoading = false;
      }
    });
  }

  loadUserPermissions(): void {
    this.isLoading = true;
    this.roleManagerService.getUserPermissions(this.data.userId).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (assignedPermissions: any) => {
        const permissionsArray = Array.isArray(assignedPermissions) ? assignedPermissions : assignedPermissions.data || [];
        
        // Populate the Set using the permission KEY
        this.assignedPermissionKeys.clear();
        permissionsArray.forEach(perm => this.assignedPermissionKeys.add(perm.key));
      },
      error: (err) => {
        this.toastService.error(err?.message || `Failed to load current permissions for ${this.data.userName}.`, 'API Error');
      }
    });
  }

  /** Groups permissions by their key prefix for UI presentation (e.g., 'PATIENT_READ' -> 'Patient Management'). */
  private groupPermissions(permissions: Permission[]): PermissionGroup[] {
    if (!Array.isArray(permissions)) return [];

    const groups = new Map<string, Permission[]>();

    permissions.forEach(p => {
      const keyPrefix = p.key?.split('_')[0] || 'Misc';
      const groupName = keyPrefix.charAt(0) + keyPrefix.slice(1).toLowerCase() + ' Management';

      if (!groups.has(groupName)) groups.set(groupName, []);
      groups.get(groupName)?.push(p);
    });

    return Array.from(groups, ([groupName, permissions]) => ({ groupName, permissions }));
  }

  // --- Permission Toggling ---

  /** Toggles the inclusion of a permission key in the set for the selected user. */
  togglePermission(permissionKey: string): void {
    if (this.assignedPermissionKeys.has(permissionKey)) {
      this.assignedPermissionKeys.delete(permissionKey);
    } else {
      this.assignedPermissionKeys.add(permissionKey);
    }
  }
  
  /** Checks if a permission is currently assigned to the user. */
  isPermissionAssigned(permissionKey: string): boolean {
    return this.assignedPermissionKeys.has(permissionKey);
  }

  // --- Saving ---

  /** Handles the submission to update permissions for the user. */
  savePermissions(): void {
    if (this.isSaving) return;

    if (!this.authService.hasPermission(this.updatePermissionKey)) {
      this.toastService.warning('Permission denied.', 'Not Authorized');
      return;
    }

    this.isSaving = true;
    const permissionKeys = Array.from(this.assignedPermissionKeys);

    this.roleManagerService.updateUserPermissions(this.data.userId, permissionKeys).pipe(
      finalize(() => this.isSaving = false)
    ).subscribe({
      next: () => {
        this.toastService.success(`User permissions for ${this.data.userName} updated successfully.`, 'Success');
        // Close the dialog and signal a successful update
        this.dialogRef.close({ permissionsUpdated: true });
      },
      error: (err) => {
        this.toastService.error(err?.message || 'Failed to update user permissions.', 'API Error');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}