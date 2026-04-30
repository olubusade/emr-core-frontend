import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDeleteFormDialogComponent } from './generic-delete-form-dialog.component';

describe('GenericDeleteFormDialogComponent', () => {
  let component: GenericDeleteFormDialogComponent;
  let fixture: ComponentFixture<GenericDeleteFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericDeleteFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDeleteFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
