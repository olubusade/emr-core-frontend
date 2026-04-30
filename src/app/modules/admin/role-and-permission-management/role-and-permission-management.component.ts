import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { ToastService } from 'src/app/core/service/toast.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { RoleManagerService } from 'src/app/modules/admin/role-and-permission-management/data/services/role-manager.service';
import { Permission } from 'src/app/core/domain/interfaces/permission.interface';
import { Role } from 'src/app/core/domain/interfaces/role.interface';
import { ConfirmDialogComponent } from '../../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { RoleFormDialogComponent } from '../../../shared/components/dialogs/role-form-dialog/role-form-dialog.component';
import { PermissionGroup } from 'src/app/core/domain/interfaces/permission-group.interface';
import { PermissionFormDialogComponent } from 'src/app/shared/components/dialogs/permission-form-dialog/permission-form-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-role-and-permission-management',
  templateUrl: './role-and-permission-management.component.html',
  styleUrls: ['./role-and-permission-management.component.scss']
})
export class RoleAndPermissionManagementComponent implements OnInit {
  
  // State variables
  allRoles: Role[] = [];
  allPermissions: Permission[] = [];
  permissionGroups: PermissionGroup[] = [];
  selectedRole: Role | null = null;
  assignedPermissionIds: Set<string> = new Set(); // Stores permission keys
  isLoading: boolean = false;
  isSaving: boolean = false; 
  
  requiredGuardPermission = 'PERMISSION_READ';

  constructor(
    private roleManagerService: RoleManagerService,
    private toastService: ToastService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    if (!this.authService.hasPermission(this.requiredGuardPermission)) {
      this.toastService.error('You are not authorized to view role management.', 'Access Denied');
    }
  }

  ngOnInit(): void {
      this.loadRolesAndPermissions(); 
  }

  /**
   * Toggles the inclusion of a permission key in the set for the selected role.
   * @param permissionKey The key of the permission being toggled.
   */
  togglePermission(permissionKey: string): void {
    if (!this.selectedRole) return;

    if (this.assignedPermissionIds.has(permissionKey)) {
      this.assignedPermissionIds.delete(permissionKey);
    } else {
      this.assignedPermissionIds.add(permissionKey);
    }
  }
  
  /** Checks if a permission is currently assigned to the selected role. */
  isPermissionAssigned(permissionKey: string): boolean {
    return this.assignedPermissionIds.has(permissionKey);
  }

  /**
   * Toggles all permissions for the currently selected role.
   * This drives the state of the "Check/Uncheck All" master checkbox.
   */
  toggleAllPermissions(event: any): void {
    if (!this.selectedRole) return;
    
    // MatCheckbox returns an object with a 'checked' property
    const isChecked = event.checked; 

    if (isChecked) {
      // Add all available permission keys to the set
      this.allPermissions.forEach(p => this.assignedPermissionIds.add(p.key));
      this.toastService.info('All permissions checked.', 'Selection Update');
    } else {
      // Clear the set to remove all permissions
      this.assignedPermissionIds.clear();
      this.toastService.info('All permissions unchecked.', 'Selection Update');
    }
  }

  /**
   * Checks if all permissions in the master list are currently assigned.
   * Used to set the 'checked' state of the master checkbox.
   */
  isAllPermissionsAssigned(): boolean {
    if (this.allPermissions.length === 0) return false;
    // Check if the size of the assigned set equals the size of the master list
    return this.assignedPermissionIds.size === this.allPermissions.length;
  }

  /** Handles the submission to update permissions for the selected role. */
  savePermissions(): void {
    if (!this.selectedRole || this.isSaving) return;

    if (!this.authService.hasPermission('PERMISSION_UPDATE')) {
      this.toastService.warning('Permission denied.', 'Not Authorized');
      return;
    }

    this.isSaving = true;
    const permissionKeys = Array.from(this.assignedPermissionIds);

    this.roleManagerService.updateRolePermissions(this.selectedRole.id, permissionKeys).pipe(
      finalize(() => this.isSaving = false)
    ).subscribe({
      next: () => {
        this.toastService.success(`Permissions for ${this.selectedRole?.name} updated successfully.`, 'Success');
      },
      error: (err) => {
        this.toastService.error('Failed to update permissions.', 'API Error');
        this.snackBar.open(err?.message || 'Error updating permission', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  
  // ----------------------------------------------------
  // ROLE CRUD Methods (Dialogs)
  // ----------------------------------------------------

  openCreateRoleDialog(): void {
    if (!this.authService.hasPermission('ROLE_CREATE')) {
      this.toastService.warning('Permission denied.', 'Not Authorized');
      return;
    }

    const dialogRef = this.dialog.open(RoleFormDialogComponent, {
      width: '400px',
      data: { isEdit: false, role: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleManagerService.createRole(result).subscribe({
          next: () => {
            this.toastService.success(`Role '${result.name}' created successfully.`, 'Success');
            this.loadRolesAndPermissions();
          },
          error: (err) => {
            this.toastService.error('Failed to create role.', 'API Error');
            this.snackBar.open(err?.message || 'Error creating role', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
/**
 * Opens a dialog to create a new Permission (Key, Name, Description).
 * Requires the 'PERMISSION_CREATE' permission.
 */
  openCreatePermissionDialog(): void {
    // 1. Guard against unauthorized access
    if (!this.authService.hasPermission('PERMISSION_CREATE')) {
      this.toastService.warning('Permission denied.', 'Not Authorized');
      return;
    }

    // 2. Open the reusable dialog component
    const permissionDialogRef = this.dialog.open(PermissionFormDialogComponent, {
      width: '450px',
    });

    // 3. Handle the result after the dialog is closed
    permissionDialogRef.afterClosed().subscribe(result => {
      // Check if the user clicked 'Create' and returned data
      if (result) {
        // result contains { key: '...', name: '...', description: '...' }
        this.roleManagerService.createPermission(result).subscribe({
          next: () => {
            this.toastService.success(`Permission '${result.name}' created successfully.`, 'Success');
            // 4. Reload permissions matrix to show the new permission
            this.loadRolesAndPermissions();
          },
          error: (err) => {
            this.toastService.error(err?.message || 'Failed to create permission. Key may already exist.', 'API Error');
          }
        });
      }
    });
  }
  confirmDeleteRole(role: Role, event: Event): void {
    event.stopPropagation();

    if (!this.authService.hasPermission('ROLE_DELETE')) {
      this.toastService.warning('Permission denied.', 'Not Authorized');
      return;
    }
    
    // SECURITY FIX: Ensure SUPER_ADMIN and ADMIN cannot be deleted.
    if (role.key === 'SUPER_ADMIN' || role.key === 'ADMIN') {
        this.toastService.error(`Cannot delete system-critical role: ${role.name}.`, 'Security Block');
        return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the role: ${role.name}? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.roleManagerService.deleteRole(role.id).subscribe({
          next: () => {
            this.toastService.success(`Role '${role.name}' deleted successfully.`, 'Success');
            this.loadRolesAndPermissions();
            this.selectedRole = null;
          },
          error: (err) => {
            this.toastService.error('Failed to delete role.', 'API Error');
            this.snackBar.open(err?.message || 'Error deleting role', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
  
  // ----------------------------------------------------
  // Data Loading and Selection
  // ----------------------------------------------------

  /** Fetches all roles and the master list of permissions. */
  loadRolesAndPermissions(): void {
    this.selectedRole = null; 
    this.assignedPermissionIds.clear();
    this.isLoading = true;

    // 1. Fetch All Roles
    this.roleManagerService.getAllRoles().subscribe({
      next: (response: any) => {
        // Safely extract the array for NgFor stability
        this.allRoles = Array.isArray(response) ? response : response.data || [];
        this.trySelectSuperAdmin();
      },
      error: (err) => {
        this.toastService.error('Failed to load roles.', 'API Error');
        this.snackBar.open(err?.message || 'Error loading permission', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });

    // 2. Fetch All Master Permissions
    this.roleManagerService.getAllPermissions().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: any) => {
        // Safely extract the array for NgFor stability
        const permissions = Array.isArray(response) ? response : response.data || [];
        
        this.allPermissions = permissions;
        this.permissionGroups = this.groupPermissions(permissions);
        this.trySelectSuperAdmin();
      },
      error: (err) => {
        this.toastService.error('Failed to load permissions list.', 'API Error');
        this.snackBar.open(err?.message || 'Error loading roles and permission', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  /** Helper to attempt selecting Super Admin after both roles and permissions are loaded. */
  private trySelectSuperAdmin(): void {
    if (this.allRoles.length > 0 && this.allPermissions.length > 0) {
      // Note: role key is 'super_admin' in the console log, but 'SUPER_ADMIN' in your checks.
      // We will check both casing variants for robustness.
      const superAdminRole = this.allRoles.find(r => r.key === 'SUPER_ADMIN' || r.key === 'super_admin');
      if (superAdminRole && !this.selectedRole) { 
         this.selectRole(superAdminRole);
      }
    }
  }

  /** Groups permissions by their key prefix for UI presentation (e.g., 'PATIENT_READ' -> 'Patient Management'). */
  private groupPermissions(permissions: Permission[]): PermissionGroup[] {
    if (!Array.isArray(permissions)) return [];

    const groups = new Map<string, Permission[]>();

    permissions.forEach(p => {
      const keyPrefix = p.key?.split('_')[0] || 'Misc';
      
      // Creates friendly name: PATIENT -> Patient Management
      const groupName = keyPrefix.charAt(0) + keyPrefix.slice(1).toLowerCase() + ' Management';

      if (!groups.has(groupName)) groups.set(groupName, []);
      groups.get(groupName)?.push(p);
    });

    return Array.from(groups, ([groupName, permissions]) => ({ groupName, permissions }));
  }

  /** Fetches the currently assigned permissions for the selected role. */
  selectRole(role: Role): void {
    this.selectedRole = role;
    this.assignedPermissionIds.clear();
    this.isLoading = true;

    this.roleManagerService.getRolePermissions(role.id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (assignedPermissions:any) => {
        const permissionsArray = Array.isArray(assignedPermissions) ? assignedPermissions : assignedPermissions.data || [];
        
        // Populate the Set using the permission KEY
        permissionsArray.forEach(perm => this.assignedPermissionIds.add(perm.key)); 
      },
      error: (err) => {
        this.toastService.error(`Failed to load permissions for ${role.name}.`, 'API Error');
        this.snackBar.open(err?.message || 'Error loading role', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.selectedRole = null;
      }
    });
  }
}