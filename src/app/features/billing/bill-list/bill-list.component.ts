import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SelectionModel } from "@angular/cdk/collections";
import { BehaviorSubject, combineLatest, forkJoin, Observable, of } from "rxjs";
import { catchError, debounceTime, finalize, map, startWith, switchMap, takeUntil, tap } from "rxjs/operators";

import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { BillService } from "../data/services/bill.service";
import { Bill } from "../data/models/bill.model";
import { BaseBillListParams } from "../data/interfaces/bill.interface";

import { GenericDeleteFormDialogComponent } from "src/app/shared/components/dialogs/generic-delete-form-dialog/generic-delete-form-dialog.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-bill-list",
  templateUrl: "./bill-list.component.html",
  styleUrls: ["./bill-list.component.scss"],
})
export class BillListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("filter", { static: true }) filter: ElementRef;

  
  displayedColumns: string[] = [
    'select',
    'fullName',
    'context',    
    'amount',
    'status',
    'createdAt',
    'dueDate',
    'actions',
  ];

  totalRecords = 0;
  currentPage = 1;
  pageSize = 5;

  isLoading: boolean = false;
  selection = new SelectionModel<Bill>(true, []);
  private pageChanged = new BehaviorSubject<number>(this.currentPage);
  private pageSizeChanged = new BehaviorSubject<number>(this.pageSize);
  private filterChanged = new BehaviorSubject<string>('');

  bills$: Observable<Bill[]>;

  constructor(
    public dialog: MatDialog,
    public billService: BillService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.loadBillsStream();
  }

  private loadBillsStream(): void {
  this.bills$ = combineLatest([
    this.pageChanged,
    this.pageSizeChanged,
    this.filterChanged.pipe(debounceTime(350), startWith(''))
  ]).pipe(
    tap(() => (this.isLoading = true)),

    switchMap(([page, limit, search]) => {
      const params: BaseBillListParams = {
        page,
        limit,
        search: search || undefined
      };

      return this.billService.listBills(params).pipe(
        tap(res => {

          this.totalRecords = res.total;
          this.pageSize = res.pageSize;
          this.currentPage = res.page;

          this.selection.clear();
        }),

        map(res => res.items),

        catchError(err => {
          console.error(err);

          this.showNotification(
            'snackbar-danger',
            err?.message || 'Failed to load bills',
            'bottom',
            'center'
          );

          return of([]);
        }),

        tap(() => (this.isLoading = false))
      );
    })
  );
}

  onPageChange(event: PageEvent) {
    this.pageSizeChanged.next(event.pageSize);
    this.pageChanged.next(event.pageIndex + 1);
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    this.filterChanged.next(value);
    this.pageChanged.next(1);
  }

  refresh() {
    this.pageChanged.next(this.pageChanged.value);
  }

  addNew(): void {
    this.router.navigate(['/billing/create']);
  }

  editBill(bill: Bill): void {
    this.router.navigate(['/billing/edit', bill.id]);
  }

  // 🗑️ Bulk Actions
  removeSelectedRows(): void {
    const selected = this.selection.selected;
    if (selected.length === 0) return;

    this.dialog.open(GenericDeleteFormDialogComponent, {
      data: { title: 'Delete Bills', message: `Delete ${selected.length} records?`, danger: true }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      
      this.isLoading = true;
      const tasks = selected.map(b => this.billService.deleteBill(`${this.billService['baseUrl']}/${b.id}`));
      
      forkJoin(tasks).subscribe({
        next: () => {
          this.showNotification('snackbar-danger', 'Deleted successfully', 'bottom', 'center');
          this.refresh();
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
    });
  }
  isAllSelected(currentData: Bill[]): boolean {
    return this.selection.selected.length === currentData.length;
  }

  masterToggle(currentData: Bill[]): void {
    this.isAllSelected(currentData) 
      ? this.selection.clear() 
      : currentData.forEach(row => this.selection.select(row));
  }

  getStatusClass(status: string): string {
    const map = { 
      paid: 'badge-solid-green', 
      unpaid: 'badge-solid-red', 
      partially_paid: 'badge-solid-orange', 
      pending: 'badge-solid-blue' 
    };
    return map[status] || 'badge-solid-purple';
  }

  showNotification(color: string, text: string, v: any, h: any) {
    this.snackBar.open(text, "", { duration: 2000, verticalPosition: v, horizontalPosition: h, panelClass: color });
  }
}