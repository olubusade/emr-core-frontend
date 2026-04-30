export interface PatientListItem {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone?: string;
    dob: string; // ISO 8601 string (Date Only)
    gender: 'male' | 'female' | 'other' | 'unknown';
    status: 'active' | 'inactive' | 'deceased' | 'suspended';
    createdAt: string;
}

// -----------------------------------------------------------
// 1. Full Structure returned by the API (READ/RESPONSE)
// -----------------------------------------------------------
export interface IPatientResponse {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    fullName: string;
    dob: string; // ISO 8601 string (Date Only)
    gender: 'male' | 'female' | 'other' | 'unknown';
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'separated';
    phone?: string;
    email: string;
    nationalId?: string;
    address?: string;
    occupation?: string;
    nationality?: string;
    stateOfOrigin?: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    genotype?: 'AA' | 'AS' | 'SS' | 'AC' | 'SC';
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyRelationship?: string;
    profileImage?: string;
    role: string;
    status: 'active' | 'inactive' | 'deceased' | 'suspended';
    createdBy?: string;
    createdAt: string; // API returns these as strings
    updatedAt: string; // API returns these as strings
}

// -----------------------------------------------------------
// 2. DTO for creating a new Patient (CREATE/REQUEST)
// -----------------------------------------------------------
export interface IPatientCreateDTO {
    firstName: string;
    lastName: string;
    fullName: string;
    password?: string; // Required for creation
    dob: string;
    gender: 'male' | 'female' | 'other' | 'unknown';
    email: string;
    // Fields that can be set on creation (optional)
    middleName?: string;
    phone?: string;
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'separated';
    nationalId?: string;
    address?: string;
    occupation?: string;
    nationality?: string;
    stateOfOrigin?: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    genotype?: 'AA' | 'AS' | 'SS' | 'AC' | 'SC';
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyRelationship?: string;
}

// -----------------------------------------------------------
// 3. DTO for updating an existing Patient (UPDATE/REQUEST)
// -----------------------------------------------------------
export interface IPatientUpdateDTO extends Partial<Omit<IPatientCreateDTO, 'email' | 'dob' | 'nationalId'>> {
    password?: string;
}

// -----------------------------------------------------------
// 5. Utility interface for paginated list response from the API
// -----------------------------------------------------------
export interface IPatientListResponse {
    // 🔑 List of full IPatientResponse objects
    items: IPatientResponse[]; 
    page: number;
    pages: number;
    total: number;
}

export interface IPatientListParams {
    page?: number;       // The requested page number (e.g., 1)
    limit?: number;      // The number of items per page (e.g., 10)
    search?: string;     // Optional: Search term (e.g., patient name or email)
    status?: 'active' | 'inactive' | 'suspended'; // Optional: Filter by patient status
}