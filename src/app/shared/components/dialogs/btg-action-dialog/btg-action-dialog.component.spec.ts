import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtgActionDialogComponent } from './btg-action-dialog.component';

describe('BtgActionDialogComponent', () => {
  let component: BtgActionDialogComponent;
  let fixture: ComponentFixture<BtgActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtgActionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtgActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
