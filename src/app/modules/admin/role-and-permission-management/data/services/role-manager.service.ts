// role-manager.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// 🔑 Assuming paths to BaseApiService and new Interfaces
import { BaseApiService } from 'src/app/core/service/base-api-service'; 
import { 
    IRoleResponse, 
    IPermissionResponse, 
    IRoleCreateDTO, 
    IPermissionCreateDTO,
    IPermissionKeysDTO,
    IRoleKeysDTO 
} from '../interfaces/role.interface'; 


@Injectable({
  providedIn: 'root'
})
// 🔑 Extend BaseApiService
export class RoleManagerService extends BaseApiService {
  private baseRoleUrl = `${environment.apiUrl}/roles`;
  private baseUserUrl = `${environment.apiUrl}/users`; // New base for user-related endpoints

  constructor(http: HttpClient) { 
    super(http); // Inject HttpClient into the base class
  }

  // --- ROLE MANAGEMENT ---

  // 1. GET All Roles
  public getAllRoles(): Observable<IRoleResponse[]> {
    return this.get<IRoleResponse[]>(this.baseRoleUrl); 
  }

  // 2. POST Create Role
  public createRole(roleData: IRoleCreateDTO): Observable<IRoleResponse> {
    return this.post<IRoleResponse>(this.baseRoleUrl, roleData);
  }

  // 3. DELETE Role
  public deleteRole(roleId: string): Observable<void> {
    // 🔑 Use the type-safe delete<void> for 204 response
    return this.delete<void>(`${this.baseRoleUrl}/${roleId}`);
  }

  // --- PERMISSION MANAGEMENT ---

  // 4. GET All Master Permissions
  public getAllPermissions(): Observable<IPermissionResponse[]> {
    return this.get<IPermissionResponse[]>(`${this.baseRoleUrl}/permissions/master`); 
  }

  // 5. POST Create Master Permission (assuming endpoint is /api/roles/permission)
  public createPermission(permissionData: IPermissionCreateDTO): Observable<IPermissionResponse> {
    return this.post<IPermissionResponse>(`${this.baseRoleUrl}/permission`, permissionData);
  }

  // 6. GET Permissions assigned to a Role
  public getRolePermissions(roleId: string): Observable<IPermissionResponse[]> {
    return this.get<IPermissionResponse[]>(`${this.baseRoleUrl}/${roleId}/permissions`); 
  }

  // 7. PUT Update Permissions for a Role
  public updateRolePermissions(roleId: string, permissionKeys: string[]): Observable<void> {
    // Backend expects { permissionKeys: [] }
    const data: IPermissionKeysDTO = { permissionKeys };
    // 🔑 Use the base service and expect void return
    return this.put<void>(`${this.baseRoleUrl}/${roleId}/permissions`, data);
  }

  // --- USER/ROLE/PERMISSION ATTACHMENT ---

  // 8. GET Roles assigned to a User
  public getUserRoles(userId: string): Observable<IRoleResponse[]> {
    return this.get<IRoleResponse[]>(`${this.baseUserUrl}/${userId}/roles`);
  }

  // 9. PUT Update Roles assigned to a User (REPLACES all roles)
  public updateUserRoles(userId: string, roleKeys: string[]): Observable<void> {
    // Backend expects { roleKeys: [] }
    const data: IRoleKeysDTO = { roleKeys };
    return this.put<void>(`${this.baseUserUrl}/${userId}/roles`, data);
  }

  // 10. GET Direct Permissions assigned to a User
  public getUserPermissions(userId: string): Observable<IPermissionResponse[]> {
    // Assuming backend returns a list of Permission objects
    return this.get<IPermissionResponse[]>(`${this.baseUserUrl}/${userId}/permissions`);
  }

  // 11. PUT Update Direct Permissions for a User (REPLACES all direct permissions)
  public updateUserPermissions(userId: string, permissionKeys: string[]): Observable<void> {
    // Backend expects { permissions: [] } or similar key
    const data = { permissions: permissionKeys };
    return this.put<void>(`${this.baseUserUrl}/${userId}/permissions`, data);
  }
}