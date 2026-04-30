import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionFormDialogComponent } from './permission-form-dialog.component';

describe('PermissionFormDialogComponent', () => {
  let component: PermissionFormDialogComponent;
  let fixture: ComponentFixture<PermissionFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
