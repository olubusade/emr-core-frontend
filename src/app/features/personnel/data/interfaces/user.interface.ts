// src/app/features/personnel/data/interfaces/user.interface.ts

import { User } from "../models/user.model";

/**
 * 1. The structure returned by the API (READ/RESPONSE)
 */
export interface IUserResponse {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    designation?: string;
    active: boolean;
    createdAt: string; // ISO String from API
    updatedAt: string; // ISO String from API
    // Assuming roles are eagerly loaded for display
    roles?: { id: string; name: string; key: string }[];
}

/**
 * 2. DTO for creating a new User (CREATE/REQUEST)
 */
export interface IUserCreateDTO {
    fName: string;
    lName: string;
    fullName: string;
    email: string;
    password: string; // Plain password for hashing on backend
    designation?: string;
    roleIds?: string[]; 
}

/**
 * 3. DTO for updating an existing User (UPDATE/REQUEST)
 */
export interface IUserUpdateDTO {
    fName?: string;
    lName?: string;
    fullName?: string;
    email?: string;
    designation?: string;
    active?: boolean;
}

/**
 * 4. Raw API Paginated Response
 */
export interface IUserListResponse {
    status: string;
    message: string;
    data: IUserResponse[]; // Your API uses 'data' instead of 'items'
    meta: {                // Your API wraps pagination in 'meta'
        page: number;
        pages: number;
        total: number;
    };
}

/**
 * 5. 🔑 The "UI-Ready" version used by the Component
 */
export interface IUserListModel {
    items: User[]; // Uses the rich Class with Date objects
    page:  number;
    pages: number;
    total: number;
}

/**
 * 6. Query Parameters for filtering
 */
export interface IUserListParams {
    search?: string;
    active?: boolean;
    roleKey?: string;
    page?: number;
    limit?: number;
}