import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtgRequestsComponent } from './btg-requests.component';

describe('BtgRequestsComponent', () => {
  let component: BtgRequestsComponent;
  let fixture: ComponentFixture<BtgRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtgRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtgRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
