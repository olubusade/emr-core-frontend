import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-audit-detail',
  templateUrl: './audit-detail.component.html',
  styleUrls: ['./audit-detail.component.sass']
})
export class AuditDetailComponent implements OnInit {
    
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
  }
  safeKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
