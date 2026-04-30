import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionistViewComponent } from './receptionist-view.component';

describe('ReceptionistViewComponent', () => {
  let component: ReceptionistViewComponent;
  let fixture: ComponentFixture<ReceptionistViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionistViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionistViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
