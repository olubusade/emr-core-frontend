import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionManagerDialogComponent } from './user-permission-manager-dialog.component';

describe('UserPermissionManagerDialogComponent', () => {
  let component: UserPermissionManagerDialogComponent;
  let fixture: ComponentFixture<UserPermissionManagerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPermissionManagerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPermissionManagerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
