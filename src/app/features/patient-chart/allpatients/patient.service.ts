import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Patient } from "./patient.model";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { environment } from "src/environments/environment";
export interface PatientApiResponse {
  status: 'SUCCESS' | 'ERROR';
  message: string;
  data: any[];                    // raw objects from API
  meta: {
    page: number;
    pages: number;
    total: number;
  };
}

// Query params your backend supports
export interface PatientQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
@Injectable()
export class PatientService extends UnsubscribeOnDestroyAdapter {

 private readonly API_URL = `${environment.apiUrl}/patients`;
  
  dataChange: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
  totalCount = 0;
  isTblLoading = true;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Patient[] {
    return this.dataChange.value;
  }
  
  /** CRUD METHODS */
  getAllPatients(page = 1, limit = 10, search = ''): void {
    this.isTblLoading = true;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search);

    this.httpClient.get<any>(this.API_URL, { params }).subscribe({
      next: (res) => {
        this.isTblLoading = false;
        this.totalCount = res.meta.total;
        this.dataChange.next(res.data.map((p: any) => new Patient(p)));
      },
      error: () => this.isTblLoading = false
    });
  }
  addPatient(patient: Patient): void {

    /*  this.httpClient.post(this.API_URL, patient).subscribe(data => {
      this.dialogData = patient;
      },
      (err: HttpErrorResponse) => {
     // error code here
    });*/
  }
  updatePatient(patient: Patient): void {

    /* this.httpClient.put(this.API_URL + patient.id, patient).subscribe(data => {
      this.dialogData = patient;
    },
    (err: HttpErrorResponse) => {
      // error code here
    }
  );*/
  }
  deletePatient(id: number): void {
    console.log(id);

    /*  this.httpClient.delete(this.API_URL + id).subscribe(data => {
      console.log(id);
      },
      (err: HttpErrorResponse) => {
         // error code here
      }
    );*/
  }
}
