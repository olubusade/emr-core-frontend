import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef
} from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";
import { Observable, interval, map, Subscription } from "rxjs";

import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { AuthService } from "src/app/core/service/auth.service";
import { PatientService } from "../data/services/patient.service";
import { BtgService } from "../../../modules/admin/btg-requests/data/services/btg.service";
import { BtgCountdownService } from "src/app/modules/admin/btg-requests/data/services/btg-countdown.service";
import { BtgSessionService } from "src/app/modules/admin/btg-requests/data/services/btg-session.service";

import { BtgSession, BTGViewer } from "src/app/modules/admin/btg-requests/data/interfaces/btg.interface";

type BtgUiState =
  | 'NONE'
  | 'PENDING'
  | 'APPROVED_ACTIVE'
  | 'APPROVED_EXPIRED'
  | 'REJECTED'
  | 'REVOKED';

@Component({
  selector: "app-patient-profile",
  templateUrl: "./patient-profile.component.html",
  styleUrls: ["./patient-profile.component.scss"],
})
export class PatientProfileComponent implements OnInit, OnDestroy {

  patientId!: string;
  patient$!: Observable<any>;

  // =========================
  // BTG INPUTS
  // =========================
  btgReason = '';
  durationMinutes = 10;

  btgReasons = [
    'Patient Unconscious',
    'Critical Vitals Review',
    'Emergency Clinical Decision',
    'Doctor Unavailable',
    'Life-threatening Situation'
  ];

  // =========================
  // BTG STREAMS
  // =========================
  
  btgViewers$!: Observable<BTGViewer[]>;
  btgCountdown$!: Observable<{ text: string; level: string }>;

  @ViewChild('btgModal') btgModal!: TemplateRef<any>;

  // =========================
  // STATE
  // =========================
  activeBTG: any = null;
  activeBTGSession: BtgSession | null = null;

  btgState: BtgUiState = 'NONE';

  uiState = {
    isLocked: false,
    canViewClinical: false,
    canViewVitals: false,
    canRequestBTG: false,
    btgState: 'NONE' as BtgUiState
  };

  BTGRequestedByMe = false;

  private heartbeatSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private authService: AuthService,
    private btgService: BtgService,
    private btgSessionService: BtgSessionService,
    private btgCountdownService: BtgCountdownService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id')!;
    this.patient$ = this.patientService.getPatientById(this.patientId);
    
    this.loadBTGStatus();

  }

  ngOnDestroy(): void {
    this.heartbeatSub?.unsubscribe();
    this.btgCountdownService.stopCountdown();
  }

  // =========================
  // ROLE HELPERS
  // =========================
  isDoctor(): boolean {
    return this.authService.getUserRoles()?.includes('doctor');
  }

  isNurse(): boolean {
    return this.authService.getUserRoles()?.includes('nurse');
  }
  // =========================
  // BTG STATUS
  // =========================
  loadBTGStatus(): void {
    
  this.btgService.getActiveBTG(this.patientId).subscribe({
    next: (res: any) => {

      this.activeBTG = res?.data ?? null;

      this.computeUIState();

      const isActive =
        this.activeBTG &&
        this.activeBTG.status === 'APPROVED' &&
        !this.activeBTG.isExpired;

      if (isActive) {

        //  Start viewers stream
        this.btgViewers$ =
          this.btgSessionService.viewersStream(this.patientId);
        
        //  Ensure session exists BEFORE heartbeat
        this.ensureSession();

      } else {

        //  Stop everything
        this.btgViewers$ = null as any;
        this.activeBTGSession = null;

        this.stopHeartbeat();
        this.btgCountdownService.stopCountdown();
      }
    },

    error: () => {
      this.activeBTG = null;

      this.computeUIState();
      this.stopHeartbeat();
      this.btgCountdownService.stopCountdown();
    }
  });
}
  // =========================
  // BTG SESSION (LIVE USERS)
  // =========================
  private ensureSession(): void {

    this.btgSessionService.getActiveBTGSession(this.patientId).subscribe({
      next: (res: any) => {

        if (res?.data) {
          //  Session exists
          this.activeBTGSession = res.data;
          this.startHeartbeat();
          return;
        }
        if (!this.isNurse() || !this.BTGRequestedByMe) return;
        // Create session immediately
        this.btgSessionService.registerViewer(
          this.activeBTG.id,
          this.patientId
        ).subscribe({
          next: () => {

            //  Fetch newly created session
            this.btgSessionService.getActiveBTGSession(this.patientId).subscribe({
              next: (sessionRes: any) => {
                this.activeBTGSession = sessionRes?.data;

                if (this.activeBTGSession) {
                  this.startHeartbeat();
                }
              }
            });
          }
        });
      }
    });
  }

private startHeartbeat(): void {
  this.heartbeatSub?.unsubscribe();
  
  if (!this.isNurse() || !this.BTGRequestedByMe) return;
  if (!this.activeBTGSession) return;

  this.heartbeatSub = interval(25000).subscribe(() => {
    this.btgSessionService.registerViewer(
      this.activeBTGSession!.btgRequestId,
      this.patientId
    ).subscribe({
      next: () => console.log('💓 Heartbeat sent'),
      error: (err) => console.error(' Heartbeat error', err)
    });
  });
}

private stopHeartbeat(): void {
  this.heartbeatSub?.unsubscribe();
  this.heartbeatSub = undefined;
}

  // =========================
  // COUNTDOWN
  // =========================


  // =========================
  // UI STATE ENGINE
  // =========================
  private computeUIState(): void {
    //check if the logged in user is the one who requested the active BTG so as to determine the UI state for the countdown timer (only requester can see the countdown and remaining time)
    this.BTGRequestedByMe = this.activeBTG?.requestedBy === this.authService.getCurrentUserId();
    
    const permissions = this.authService.getUserPermissions?.() || [];

    const isClinicalStaff = this.isDoctor() || this.isNurse();

    //default view is based on RBAC permissions - Doctor and Admin who can create not can view by default
    
    const canViewClinical =
      permissions.some((p: any) => p.key === 'CLINICAL_NOTE_CREATE');

    const canViewVitals =
      permissions.some((p: any) => p.key === 'VITAL_READ');

    const canRequestBTG =
      permissions.some((p: any) => p.key === 'BREAK_GLASS_REQUEST');

    // =========================
    // BTG STATE
    // =========================
    let state: BtgUiState = 'NONE';

    if (this.activeBTG) {
      if (this.activeBTG.status === 'PENDING' && !this.activeBTG.isExpired) {
        state = 'PENDING';
      } else if (this.activeBTG.status === 'APPROVED' && !this.activeBTG.isExpired) {
        state = 'APPROVED_ACTIVE';
      } else if (this.activeBTG.status === 'APPROVED' && this.activeBTG.isExpired) {
        state = 'APPROVED_EXPIRED';
      } else if (this.activeBTG.status === 'REJECTED') {
        state = 'REJECTED';
      
      } else if (this.activeBTG.status === 'REVOKED') {
        state = 'REVOKED';
      }
    }

    this.btgState = state;

    const hasBTGAccess = state === 'APPROVED_ACTIVE';

    // =========================
    // FINAL UI STATE
    // =========================
    
    this.uiState = {
      isLocked: !isClinicalStaff,

      canViewClinical: canViewClinical || hasBTGAccess,
      canViewVitals: canViewVitals || hasBTGAccess,

      canRequestBTG:
        isClinicalStaff &&
        canRequestBTG &&
        (state === 'NONE' || state === 'REJECTED' || state === 'REVOKED' || this.activeBTG.isExpired),

      btgState: state
    };
    
    // If BTG just got approved, start countdown and viewers stream
    if (this.activeBTG?.status === 'APPROVED' && !this.activeBTG?.isExpired) {
        this.btgCountdown$ = this.btgCountdownService.startCountdown(
          this.activeBTG.expiresAt
        );
    }
    
  }


  // =========================
  // BTG ACTIONS
  // =========================
  openBTGModal(): void {
    this.dialog.open(this.btgModal);
  }

  submitBTG(): void {
    this.btgService.requestBTG({
      patientId: this.patientId,
      reason: this.btgReason,
      durationMinutes: this.durationMinutes
    }).subscribe({
      next: () => {
        this.dialog.closeAll();
        this.snackBar.open('BTG request submitted', 'Close', { duration: 3000 });
        this.loadBTGStatus();
      },
      error: () => {
        this.snackBar.open('Failed to submit request', 'Close', { duration: 3000 });
      }
    });
  }

  handleHistorySelect(note: any): void {
    if (!note?.appointmentId) return;

    this.router.navigate(
      [`/doctor/clinical/capture/${note.appointmentId}`],
      {
        queryParams: {
          patientId: this.patientId,
          status: 'completed'
        }
      }
    );
  }
}