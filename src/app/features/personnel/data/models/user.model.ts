import { IUserResponse } from "../interfaces/user.interface";

/**
 * Class representing the User entity (The rich Domain Model).
 */
export class User {
  // Core properties
  public id!: string;
  public fName?: string;
  public lName?: string;
  public fullName!: string;
  public email!: string;
  public active!: boolean;
  public designation?: string;
  public role?: string; // Original role string from API

  // Relational data
  public roles: { id: string; name: string; key: string }[] = [];

  // Transformed fields (Date objects)
  public createdAt!: Date;
  public updatedAt!: Date;

  // Change to public or use the static factory properly
  constructor(data?: Partial<IUserResponse>) {
    if (data) {
      this.id = data.id!;
      this.fName = data.firstName;
      this.lName = data.lastName;
      this.fullName = data.fullName || '';
      this.email = data.email || '';
      this.active = !!data.active;
      this.role = (data as any).role; // Capture the raw role string
      
      // 🔑 Map 'role' string to 'designation' for UI consistency
      this.designation = (data as any).role || data.designation;

      this.roles = data.roles || [];
      
      // Transformation: Convert string timestamps to Date objects
      this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
      this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    }
  }

  /**
   * Static Factory Method: Ensures all User instances are created cleanly from API data.
   */
  public static fromApi(data: IUserResponse): User {
    return new User(data);
  }

  /**
   * Utility: Gets the primary role name for display.
   * Logic: Returns the 'role' string if it exists, otherwise looks at 'roles' array.
   */
  public get primaryRoleName(): string {
    if (this.role) return this.role;
    return this.roles.length > 0 ? this.roles[0].name : 'Unassigned';
  }

  /**
   * Utility: Checks if the user has a specific role key.
   */
  public hasRole(key: string): boolean {
    // Check both the single role string and the roles array
    if (this.role === key) return true;
    return this.roles.some(role => role.key === key);
  }
}