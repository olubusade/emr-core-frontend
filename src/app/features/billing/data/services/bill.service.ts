import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseApiService } from 'src/app/core/service/base-api-service';
import { Bill } from '../models/bill.model';
import {
  IBillResponse,
  IBillCreateDTO,
  IBillUpdateDTO,
  IBillListResponse,
  BaseBillListParams,
  IBillListModel,
} from '../interfaces/bill.interface';

@Injectable({ providedIn: 'root' })
export class BillService extends BaseApiService {
  private baseUrl = `${environment.apiUrl}/bills`;

  constructor(http: HttpClient) {
    super(http);
  }

public listBills(params: BaseBillListParams): Observable<IBillListModel> {
  return this.get<any>(this.baseUrl, params).pipe(
    map((response: any) => {
      console.log('📦 RAW API RESPONSE:', response);

      const data = response?.data || [];

      const items = data.map((item: any) =>
        Bill.fromApi(item)
      );

      return {
        items,
        total: response?.meta?.total ?? 0,
        page: response?.meta?.page ?? 1,
        pages: response?.meta?.pages ?? 1,
        pageSize: response?.meta?.pageSize ?? params.limit ?? 10
      };
    }),
    catchError(err => {
      console.error('❌ Bill Service Error:', err);

      return of({
        items: [],
        total: 0,
        page: 1,
        pages: 1,
        pageSize: params.limit || 10
      });
    })
  );
}
getPendingBills(params: BaseBillListParams): Observable<any> {
  return this.get<IBillListResponse>(`${this.baseUrl}/patients`, params).pipe(
    map((response: any) => {
      
      const mappedItems = (response.data || []).map((item: any) => Bill.fromApi(item));

      // 3. Return the model the Component expects
      return {
        items: mappedItems,
        total: response.meta?.total || 0,
        page: response.meta?.page || 1,
        pages: response.meta?.pages || 1
      };
    }),
    catchError(err => {
      console.error('❌ Service Error:', err);
      return of({ items: [], total: 0, page: 1, pages: 1 });
    })
  );
}

  getBill(id: string): Observable<Bill> {
    return this.get<IBillResponse>(`${this.baseUrl}/${id}`).pipe(map(Bill.fromApi));
  }

  createBill(data: IBillCreateDTO): Observable<Bill> {
    return this.post<IBillResponse>(this.baseUrl, data).pipe(map(Bill.fromApi));
  }

  updateBill(id: string, data: IBillUpdateDTO): Observable<Bill> {
    return this.patch<IBillResponse>(`${this.baseUrl}/${id}`, data).pipe(map(Bill.fromApi));
  }

  deleteBill(id: string): Observable<void> {
    return this.delete<void>(`${this.baseUrl}/${id}`);
  }
}