import { Component, OnInit } from '@angular/core';
import { BtgService } from './data/services/btg.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { interval, startWith, map } from 'rxjs';
import { BtgActionDialogComponent } from 'src/app/shared/components/dialogs/btg-action-dialog/btg-action-dialog.component';

type BtgStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'REVOKED';

@Component({
  selector: 'app-btg-requests',
  templateUrl: './btg-requests.component.html',
  styleUrls: ['./btg-requests.component.scss']
})
export class BtgRequestsComponent implements OnInit {

  loading = false;

  requests: any[] = [];

  selectedFilter: BtgStatus | 'ALL' = 'ALL';
  displayedColumns = [
    'patient',
    'approver',
    'requester',
    'designation',
    'reason',
      'status',
    'expiry', 
    'createdAt',
    'actions'
  ];
  totalRecords = 0;
  pageSize = 20;
  page = 1;
  

  constructor(
    private btgService: BtgService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

loadRequests(): void {
  this.loading = true;

  this.btgService.getBTGRequests({
    page: this.page,
    limit: this.pageSize
  }).subscribe({
    next: (res: any) => {

      const now = Date.now();

      this.requests = (res?.data || []).map((r: any) => ({
        ...r,
        isExpired: r.expiresAt
          ? new Date(r.expiresAt).getTime() < now
          : false,

        // ⬇️ add helper field for UI
        timeLeft$: r.status === 'APPROVED'
          ? this.createCountdown$(r.expiresAt)
          : null
      }));

      this.totalRecords = res?.meta?.total || 0;
      this.loading = false;
    },
    error: () => {
      this.loading = false;
      this.snackBar.open('Failed to load BTG requests', 'Close', { duration: 3000 });
    }
  });
}
  createCountdown$(expiresAt: string) {
  const expiry = new Date(expiresAt).getTime();

  return interval(1000).pipe(
    startWith(0),
    map(() => {
      const diff = expiry - Date.now();

      if (diff <= 0) {
        return {
          expired: true,
          display: 'Expired'
        };
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      return {
        expired: false,
        display: `${minutes}m ${seconds}s`
      };
    })
  );
}

approve(request: any): void {
  const dialogRef = this.dialog.open(BtgActionDialogComponent, {
    width: '450px',
    data: { action: 'APPROVE' }
  });

  dialogRef.afterClosed().subscribe(reason => {
    if (!reason) return;    
    const decisionReason = reason;

    this.btgService.approveBTG(request.id, { decisionReason }).subscribe({
      next: (res: any) => {
        const expiresAt = res?.data?.expiresAt;

        this.snackBar.open(
          `Approved. Valid until ${new Date(expiresAt).toLocaleTimeString()}`,
          'Close',
          { duration: 3000 }
        );

        this.loadRequests();
      }
    });
  });
}

  reject(request: any): void {
  const dialogRef = this.dialog.open(BtgActionDialogComponent, {
    width: '450px',
    data: { action: 'REJECT' }
  });

  dialogRef.afterClosed().subscribe(reason => {
    if (!reason) return;
    const decisionReason = reason;

    this.btgService.rejectBTG(request.id, { decisionReason }).subscribe({
      next: () => {
        this.snackBar.open('Request rejected', 'Close', { duration: 2500 });
        this.loadRequests();
      }
    });
  });
}

expire(request: any): void {
  const dialogRef = this.dialog.open(BtgActionDialogComponent, {
    width: '450px',
    data: { action: 'REVOKE' }
  });

  dialogRef.afterClosed().subscribe(reason => {
    if (!reason) return;
    const decisionReason = reason;
    this.btgService.expireBTG(request.id, { decisionReason }).subscribe({
      next: () => {
        this.snackBar.open('Access revoked', 'Close', { duration: 2500 });
        this.loadRequests();
      }
    });
  });
}

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadRequests();
  }

get filteredRequests(): any[] {
  if (this.selectedFilter === 'ALL') return this.requests;

  if (this.selectedFilter === 'EXPIRED') {
    return this.requests.filter(r => r.isExpired);
  }

  return this.requests.filter(r => r.status === this.selectedFilter);
}
}