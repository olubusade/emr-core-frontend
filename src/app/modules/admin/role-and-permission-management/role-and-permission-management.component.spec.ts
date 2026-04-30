import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAndPermissionManagementComponent } from './role-and-permission-management.component';

describe('RoleAndPermissionManagementComponent', () => {
  let component: RoleAndPermissionManagementComponent;
  let fixture: ComponentFixture<RoleAndPermissionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleAndPermissionManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleAndPermissionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
