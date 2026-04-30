// clinicalNote.interface.ts

// 1. The structure returned by the API (READ/RESPONSE)
export interface IClinicalNoteResponse {
    id: string; 
    patientId: string;
    staffId: string; 
    // 🔑 NEW
    diagnosis?: string; 
    noteType?: string; // Removed from model, keeping optional in response for legacy/related types
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    createdAt: string; 
    updatedAt: string;
    
    patient?: { firstName: string; lastName: string };
}

// 2. DTO for creating a new Note (CREATE/REQUEST)
// staffId and patientId are required for creation
export interface IClinicalNoteCreateDTO {
    patientId: string;
    staffId: string;
    // 🔑 NEW: Include diagnosis in creation DTO
    diagnosis?: string; 
    noteType?: string; // Optional if not present in new model
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

// 3. DTO for updating an existing Note (UPDATE/REQUEST)
export interface IClinicalNoteUpdateDTO extends Partial<Omit<IClinicalNoteCreateDTO, 'patientId' | 'staffId'>> {}

// 4. Params for filtering notes (no change)
export interface IClinicalNoteListParams {
    patientId?: string;
    staffId?: string;
    page?: number;
    limit?: number;
}

// 5. Utility interface for paginated list response (no change)
export interface IClinicalNoteListResponse {
    items: IClinicalNoteResponse[];
    page: number;
    pages: number;
    total: number;
}