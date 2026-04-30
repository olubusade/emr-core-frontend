// --- Interfaces (Must match your backend models) ---
export interface Role {
  id: string; 
  key: string; // e.g., 'DOCTOR'
  name: string; // e.g., 'Doctor'
}