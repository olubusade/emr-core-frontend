import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { SelectionModel } from "@angular/cdk/collections";
import { Router } from "@angular/router";
import { fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { PatientService } from "./patient.service";
import { Patient } from "./patient.model";

@Component({
  selector: "app-allpatients",
  templateUrl: "./allpatients.component.html",
  styleUrls: ["./allpatients.component.sass"],
})
export class AllpatientsComponent implements OnInit {
  patients: Patient[] = [];

  displayedColumns = [
    /* 'select', */
    'id',
    "fullName",
    "gender",
    "email",
    "phone",
    "bloodGroup",
    "dob",
    "status",
    "actions",
  ];

  selection = new SelectionModel<Patient>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("filter", { static: true }) filter: ElementRef;

  isTblLoading = true;

  // server params
  page = 1;
  pageSize = 10;
  search = "";

  constructor(
    public patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.initFilter();
  }

  /** LOAD DATA FROM SERVER */
  loadPatients(): void {
    this.isTblLoading = true;

    this.patientService.getAllPatients(this.page, this.pageSize, this.search);

    this.patientService.dataChange.subscribe((data) => {
      this.patients = data;
      this.isTblLoading = false;
    });
  }

  /** SEARCH (SERVER SIDE) */
  initFilter(): void {
    fromEvent(this.filter.nativeElement, "keyup")
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.search = this.filter.nativeElement.value;
        this.page = 1; // reset to first page
        this.loadPatients();
      });
  }

  /** PAGINATION */
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPatients();
  }

  /** ACTIONS */
  refresh(): void {
    this.loadPatients();
  }

  addNew(): void {
    this.router.navigateByUrl("/patients/add");
  }

  editPatient(row: Patient): void {
    this.router.navigateByUrl(`/patients/edit/${row.id}`);
  }

  /** SELECTION */
  isAllSelected(): boolean {
    return this.selection.selected.length === this.patients.length;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.patients.forEach((row) => this.selection.select(row));
  }
}