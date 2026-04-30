import { IClinicalNoteResponse } from "../interfaces/clinical-note.interface";

/**
 * Class representing the Clinical Note entity (The rich Domain Model).
 */
export class ClinicalNote {
    // Required fields
    public id!: string;
    public patientId!: string;
    public staffId!: string;
    
    // 🔑 NEW FIELD
    public diagnosis?: string; 
    
    public subjective!: string;
    public objective!: string;
    public assessment!: string;
    public plan!: string;
    public noteType?: string; // Optional based on model context

    // Transformed fields (Date objects)
    public createdAt!: Date;
    public updatedAt!: Date;

    // Relational data
    public patient?: { firstName: string; lastName: string };

    // Private constructor to enforce use of static factory methods
    private constructor(data: IClinicalNoteResponse) {
        Object.assign(this, data);

        // Transformation: Convert string timestamps to Date objects
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
    }

    /**
     * Static Factory Method: Ensures all instances are created cleanly from API data.
     */
    public static fromApi(data: IClinicalNoteResponse): ClinicalNote {
        return new ClinicalNote(data);
    }

    /**
     * Utility: Provides a short summary of the note, favoring diagnosis.
     */
    public get summary(): string {
        return this.diagnosis || this.assessment || 'Clinical Note';
    }
}