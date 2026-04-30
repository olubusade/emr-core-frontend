// src/app/features/personnel/data/services/staff.service.ts (CORRECTED)

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { BaseApiService } from 'src/app/core/service/base-api-service'; 
import { User } from '../models/user.model';
import { 
    IUserResponse, 
    IUserCreateDTO, 
    IUserUpdateDTO, 
    IUserListResponse, 
    IUserListParams, 
    IUserListModel
} from '../interfaces/user.interface';

// REMOVED: Patient-related imports, they don't belong here.

@Injectable({ providedIn: 'root' })
export class StaffService extends BaseApiService {
    private baseUrl = `${environment.apiUrl}/users`; // Assuming '/users' endpoint
    isTblLoading: boolean = false;

    constructor(http: HttpClient) {
        super(http);
    }
    
    // 🔑 ADDED: The core list method for this service
    /**
     * Retrieves a paginated list of users (staff).
     */
public listUsers(params: any): Observable<IUserListModel> {
  return this.get<any>(`${this.baseUrl}`, params).pipe(
    map((res: any) => {

      const payload = res?.data ?? res;
      return {
        items: payload ?? [],
        total: res?.meta?.total ?? 0,
        page: res?.meta?.page ?? 1,
        pages: res?.meta?.pages ?? 1
      } as IUserListModel;
    }),
    catchError(err => {
      console.error('User list error:', err);
      return of({
        items: [],
        total: 0,
        page: 1,
        pages: 1
      } as IUserListModel);
    })
  );
}


    /**
     * Retrieves a single user by ID.
     */
    public getUser(id: string): Observable<User> {
        return this.get<IUserResponse>(`${this.baseUrl}/${id}`).pipe(
            map(User.fromApi)
        );
    }

    // ... (createUser, updateUser, deactivateUser methods remain unchanged) ...
    public createUser(data: IUserCreateDTO): Observable<User> { /* ... */ return null as any; } // Simplified for brevity
    public updateUser(id: string, data: IUserUpdateDTO): Observable<User> { /* ... */ return null as any; } // Simplified for brevity
    public deactivateUser(id: string): Observable<void> { /* ... */ return null as any; } // Simplified for brevity
}