import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFormDialogComponent } from './bill-form-dialog.component';

describe('BillFormDialogComponent', () => {
  let component: BillFormDialogComponent;
  let fixture: ComponentFixture<BillFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
