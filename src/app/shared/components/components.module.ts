import { NgModule } from '@angular/core';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

import { EmptyStateComponent } from './empty-state/empty-state.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialFileInputModule } from 'ngx-material-file-input';

import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { PermissionFormDialogComponent } from './dialogs/permission-form-dialog/permission-form-dialog.component';
import { RoleFormDialogComponent } from './dialogs/role-form-dialog/role-form-dialog.component';
import { UserPermissionManagerDialogComponent } from './dialogs/user-permission-manager-dialog/user-permission-manager-dialog.component';
import { GenericDeleteFormDialogComponent } from './dialogs/generic-delete-form-dialog/generic-delete-form-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookApptFormDialogComponent } from './dialogs/book-appt-form-dialog/book-appt-form-dialog.component';

import { BillFormDialogComponent } from './dialogs/bill-form-dialog/bill-form-dialog.component';
import { ModalWrapperComponent } from './dialogs/modal-wrapper/modal-wrapper.component';
import { NoRecordFoundComponent } from './no-record-found/no-record-found.component';
import { FeatherIconsModule } from './feather-icons/feather-icons.module';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { BtgActionDialogComponent } from './dialogs/btg-action-dialog/btg-action-dialog.component';


@NgModule({
  declarations: [
    FileUploadComponent,
    BreadcrumbComponent,
    EmptyStateComponent,
    PermissionFormDialogComponent,
    ConfirmDialogComponent,
    RoleFormDialogComponent,
    UserPermissionManagerDialogComponent,
    GenericDeleteFormDialogComponent,
  
    BillFormDialogComponent,
    ModalWrapperComponent,
    BookApptFormDialogComponent,
    NoRecordFoundComponent,
    BtgActionDialogComponent

  ],
  imports: [     
      MatTableModule,
      MatPaginatorModule,
      MatFormFieldModule,
      MatInputModule,
      MatSnackBarModule,
      MatButtonModule,
      MatIconModule,
      MatDialogModule,
      MatSortModule,
      MatToolbarModule,
      MatSelectModule,
      MatDatepickerModule,
      MatTabsModule,
      MatCheckboxModule,
      MaterialFileInputModule,
      FeatherIconsModule,
      MatProgressSpinnerModule,
      FormsModule,
      ReactiveFormsModule,
      MatRadioModule,
      RouterModule,
    MatDividerModule,
      CommonModule
    
      
          
  ],
  exports: [FileUploadComponent, BreadcrumbComponent,
    EmptyStateComponent,
    PermissionFormDialogComponent,
    ConfirmDialogComponent,
    RoleFormDialogComponent,
    UserPermissionManagerDialogComponent,
    BtgActionDialogComponent,
    
    ModalWrapperComponent,
    BookApptFormDialogComponent,
    NoRecordFoundComponent
  
  ],
})
export class ComponentsModule {}
