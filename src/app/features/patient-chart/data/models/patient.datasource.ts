import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

import { PatientService } from "../services/patient.service";
import { Patient } from "../models/patient.model";

export class PatientDataSource extends DataSource<Patient> {
  filterChange = new BehaviorSubject<string>("");

  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  filteredData: Patient[] = [];
  renderedData: Patient[] = [];

  constructor(
    private patientService: PatientService,
    private paginator: MatPaginator,
    private sort: MatSort
  ) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  connect(): Observable<Patient[]> {
    const displayChanges = [
      this.patientService.dataChange,
      this.sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];

    return merge(...displayChanges).pipe(
      map(() => {
        const data = this.patientService.data;

        // ✅ FILTER (aligned with real fields)
        this.filteredData = data.filter((p) => {
          const searchStr = (
            p.fullName +
            p.email +
            p.phone +
            p.gender +
            (p.bloodGroup || "") +
            p.status
          ).toLowerCase();

          return searchStr.includes(this.filter.toLowerCase());
        });

        // ✅ SORT
        const sortedData = this.sortData(this.filteredData.slice());

        // ✅ PAGINATION
        const startIndex =
          this.paginator.pageIndex * this.paginator.pageSize;

        this.renderedData = sortedData.slice(
          startIndex,
          startIndex + this.paginator.pageSize
        );

        return this.renderedData;
      })
    );
  }

  disconnect(): void {}

  private sortData(data: Patient[]): Patient[] {
    if (!this.sort.active || this.sort.direction === "") return data;

    return data.sort((a, b) => {
        let valueA: any = "";
        let valueB: any = "";

        switch (this.sort.active) {
        case "fullName":
            valueA = a.fullName;
            valueB = b.fullName;
            break;
        case "email":
            valueA = a.email;
            valueB = b.email;
            break;
        case "phone":
            valueA = a.phone;
            valueB = b.phone;
            break;
        case "gender":
            valueA = a.gender;
            valueB = b.gender;
            break;
        case "dob":
            valueA = a.dob;
            valueB = b.dob;
            break;
        case "bloodGroup":
            valueA = a.bloodGroup || "";
            valueB = b.bloodGroup || "";
            break;
        case "status":
            valueA = a.status;
            valueB = b.status;
            break;
        default:
            return 0; // ✅ ALWAYS return number
        }

        // Normalize nulls
        valueA = valueA ?? "";
        valueB = valueB ?? "";

        const result =
        valueA < valueB ? -1 :
        valueA > valueB ? 1 : 0;

        return this.sort.direction === "asc" ? result : -result;
    });
  }
}