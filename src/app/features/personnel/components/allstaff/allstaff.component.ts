import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import { DataSource } from "@angular/cdk/collections";

import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject, fromEvent, merge, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from "rxjs/operators";
import { SelectionModel } from "@angular/cdk/collections";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";

import { UserDeleteDialogComponent } from "src/app/features/personnel/components/dialogs/user-delete-dialog/user-delete.component";
import { AuthService } from "src/app/core/service/auth.service";
import { ToastService } from "src/app/core/service/toast.service";
import { UserActionService } from "src/app/core/service/user-action.service";
import { IUserListModel, IUserListParams } from "../../data/interfaces/user.interface";
import { StaffService } from "../../data/services/user.service";
import { User } from "../../data/models/user.model";
@Component({
  selector: "app-allstaff",
  templateUrl: "./allstaff.component.html",
  styleUrls: ["./allstaff.component.sass"],
})
export class AllstaffComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    "select",
    "img",
    "name",
    "designation",
    "mobile",
    "email",
    "date",
    "address",
    "actions",
  ];
  selection = new SelectionModel<User>(true, []);
  dataSource: ExampleDataSource | null;
  index: number;
  id: number;
  staff: User | null;
  pageSize = 5;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public staffService: StaffService,
    private snackBar: MatSnackBar,
    private toastService: ToastService,
    private authService: AuthService,
    private userActionService: UserActionService
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  ngOnInit() {
    this.loadData();
  }
  refresh() {
    this.loadData();
  }
  addNew() {
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    /* const dialogRef = this.dialog.open(StaffFormDialogComponent, {
      data: {
        staff: this.staff,
        action: "add",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase.dataChange.value.unshift(
          this.staffService.getDialogData()
        );
        this.refreshTable();
        this.showNotification(
          "snackbar-success",
          "Add Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    }); */
  }
  manageUserPermissions(user: any): void {
    // 1. (Optional) Local check, though often handled by the directive
    if (!this.authService.hasPermission('USER_PERMISSION_UPDATE')) {
        this.toastService.warning('Permission denied.', 'Not Authorized');
        return;
    }
    
    // 2. 🚀 Single line call to the centralized logic!
    this.userActionService.manageUserPermissions(user);
    // Note: No need for .afterClosed() or refresh logic here unless strictly necessary
  }
  editCall(row) {
    this.id = row.id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    /* const dialogRef = this.dialog.open(StaffFormDialogComponent, {
      data: {
        staff: row,
        action: "edit",
      },
      direction: tempDirection,
    }); 
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)
        this.exampleDatabase.dataChange.value[foundIndex] =
          this.staffService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
        this.showNotification(
          "black",
          "Edit Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
    */
  }
  deleteItem(row) {
    this.id = row.id;
    let tempDirection;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(UserDeleteDialogComponent, {
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
       
        this.refreshTable();
        this.showNotification(
          "snackbar-danger",
          "Delete Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
          this.selection.select(row)
        );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      
      this.refreshTable();
      this.selection = new SelectionModel<User>(true, []);
    });
    this.showNotification(
      "snackbar-danger",
      totalSelect + " Record Delete Successfully...!!!",
      "bottom",
      "center"
    );
  }
  public loadData() {
  // Combine all triggers for a data refresh
  const displayDataChanges = [
    this.paginator.page,
    this.sort.sortChange,
    fromEvent(this.filter.nativeElement, "keyup").pipe(
      debounceTime(400),       // Wait for user to stop typing
      distinctUntilChanged()   // Only trigger if the search term actually changed
    )
  ];

  this.subs.sink = merge(...displayDataChanges)
    .pipe(
      startWith({}),
      switchMap(() => {
        this.staffService.isTblLoading = true;
        
        const params: IUserListParams = {
          page: this.paginator.pageIndex + 1, // MatPaginator is 0-indexed, API is likely 1-indexed
          limit: this.paginator.pageSize,
          search: this.filter.nativeElement.value
        };

        return this.staffService.listUsers(params);
      })
    )
    .subscribe({
      next: (res: IUserListModel) => {
        this.staffService.isTblLoading = false;
        
        // 🔑 Crucial: Update the renderedData so the table picks up the new array
        if (this.dataSource) {
          this.dataSource.renderedData = res.items;
        }
        
        // Update paginator length so it knows the total records on the server
        this.paginator.length = res.total;
      },
      error: (err) => {
        this.staffService.isTblLoading = false;
        this.showNotification("snackbar-danger",err.message || "Error loading staff records", "bottom", "center");
      }
    });
}

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
export class ExampleDataSource extends DataSource<User> {
  renderedData: User[] = [];
  
  constructor(
    public staffService: StaffService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
  }

  // Since we are subscribing in the component and pushing data into renderedData,
  // we return a BehaviorSubject or a simple observable here.
  connect(): Observable<User[]> {
    return new BehaviorSubject<User[]>(this.renderedData).asObservable();
  }

  disconnect() {}
}
