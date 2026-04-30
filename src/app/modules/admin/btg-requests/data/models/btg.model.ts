import { BtgRequest } from "../interfaces/btg.interface";


export class BtgRequestModel implements BtgRequest {
  constructor(
    public patientId: string,
    public reason: string,
    public status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED' = 'PENDING'
  ) {}

  static create(payload: Partial<BtgRequest>): BtgRequest {
    return {
      patientId: payload.patientId!,
      reason: payload.reason!,
      status: 'PENDING'
    };
  }
}