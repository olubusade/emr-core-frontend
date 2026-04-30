import { IPatientResponse, PatientListItem } from "../interfaces/patient.interface";


// NOTE: This class is often used as the 'Patient' type itself.
export class Patient {
    // 🔑 Core Patient Properties (matching IPatientResponse, but cleaned up/typed)
    public readonly id: string;
    public readonly fullName: string;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly maritalStatus: string;
    public readonly nationality: string;
    public readonly stateOfOrigin: string;
    public readonly occupation: string;
    public readonly email: string;
    public readonly phone: string | null;
    public readonly dob: Date; // Converted from string to Date object
    public readonly gender: string;
    public readonly status: string;
    public readonly createdAt: Date; // Converted from string to Date object
    
    // Detailed Properties
    public readonly nationalId: string | null;
    public readonly address: string | null;
    public readonly bloodGroup: string | null;
    public readonly genotype: string | null;
  //public readonly emergencyContact: { name: string | null; phone: string | null; relationship: string | null; };
   public readonly emergencyContactName: string | null;
   public readonly emergencyContactPhone: string | null;
   public readonly emergencyRelationship: string | null;
    

    // 🔑 Private constructor forces instantiation via static factory methods
    private constructor(data: IPatientResponse) {
        this.id = data.id;
        this.fullName = data.fullName; 
        this.firstName = data.firstName;
        this.lastName = data.lastName;

        this.email = data.email;
        this.phone = data.phone || null;
        
        // Data Transformation: Convert string dates/DOB into Date objects
        this.dob = new Date(data.dob); 
        this.createdAt = new Date(data.createdAt);
        
        this.gender = data.gender;
        this.status = data.status;
        this.address = data.address || null;
        this.nationality = data.nationality;
        this.stateOfOrigin = data.stateOfOrigin;
        this.maritalStatus = data.maritalStatus;
        this.occupation = data.occupation;

        this.nationalId = data.nationalId || null;
        this.bloodGroup = data.bloodGroup || null;
        this.genotype = data.genotype || null;
        
        /* this.emergencyContact = {
            name: data.emergencyContactName || null,
            phone: data.emergencyContactPhone || null,
            relationship: data.emergencyRelationship || null,
        }; */
       // 🔥 FIX: align with API
    this.emergencyContactName = data.emergencyContactName || null;
    this.emergencyContactPhone = data.emergencyContactPhone || null;
    this.emergencyRelationship = data.emergencyRelationship || null;
    }

    /**
     * 1. Factory method to create a full Patient model instance from a raw API response.
     */
    public static fromApi(response: IPatientResponse): Patient {
        return new Patient(response);
    }

    /**
     * 2. Factory method to create a simplified PatientListItem for tables/dashboards.
     * This is used specifically by the PatientService's listPatients method.
     */
    public static fromApiToListItem(response: IPatientResponse): PatientListItem {
        // NOTE: This assumes PatientListItem is a simple interface defining only the fields you need for the list
        return {
            id: response.id,
            firstName: response.firstName,
            lastName: response.lastName,
            fullName: response.fullName,
            email: response.email,
            phone: response.phone,
            dob: response.dob,
            status: response.status,
            createdAt: response.createdAt
        } as PatientListItem; 
    }

 // ===============================
  // DERIVED PROPERTIES
  // ===============================


  public get age(): number | null {
    if (!this.dob) return null;
    const birth = new Date(this.dob);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : null;
  }

  get displayDob(): string {
    return this.dob ? new Date(this.dob).toLocaleDateString('en-GB') : '—';
  }

  get displayStatus(): string {
    return this.status ? this.status.charAt(0).toUpperCase() + this.status.slice(1) : '—';
  }

  //SAFE ACCESSOR (optional future-proofing)
  get emergencyContact() {
    return {
      name: this.emergencyContactName,
      phone: this.emergencyContactPhone,
      relationship: this.emergencyRelationship,
    };
  }
}