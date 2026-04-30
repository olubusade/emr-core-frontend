import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { debounceTime, map, switchMap, tap, catchError, startWith } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Audit } from './data/models/audit.model';
import { AuditService } from './data/services/audit.service';
import { MatDialog } from '@angular/material/dialog';
import { AuditDetailComponent } from './audit-detail/audit-detail.component';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  displayedColumns: string[] = [
    'action',
    'entity',
    'userId',
    'user',
    'role',
    'ipAddress',
    'createdAt',
    'details'
  ];

  audits$: Observable<Audit[]>;

  totalRecords = 0;
  pageSize = 5;
  currentPage = 1;
  isLoading = false;

  private pageChanged = new BehaviorSubject<number>(this.currentPage);
  private pageSizeChanged = new BehaviorSubject<number>(this.pageSize);
  private filterChanged = new BehaviorSubject<string>('');

  constructor(private auditService: AuditService,
      private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAuditStream();
  }
  viewDetails(audit: any): void {
    this.dialog.open(AuditDetailComponent, {
      width: '600px',
      data: audit
    });
  }
  
  private loadAuditStream(): void {
    this.audits$ = combineLatest([
      this.pageChanged,
      this.pageSizeChanged,
      this.filterChanged.pipe(debounceTime(300), startWith(''))
    ]).pipe(
      tap(() => this.isLoading = true),

      switchMap(([page, pageSize, search]) =>
        this.auditService.listAudits({
          page,
          pageSize,
          entity: search || undefined // 👈 adjust if backend expects "search"
        }).pipe(
          tap(res => {
            
            this.isLoading = false;

            // ✅ Sync everything with backend meta
            this.totalRecords = res.meta.total;
            this.pageSize = res.meta.pageSize;
            this.currentPage = res.meta.page;
          }),

          map(res => res.data.map(a => Audit.fromApi(a))),

          catchError(() => {
            this.isLoading = false;
            return of([]);
          })
        )
      )
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageSizeChanged.next(event.pageSize);
    this.pageChanged.next(event.pageIndex + 1); // backend is 1-based
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();

    this.filterChanged.next(value);
    this.pageChanged.next(1); // reset to first page
  }
}