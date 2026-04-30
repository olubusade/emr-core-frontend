import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalFormComponent } from './vital-form.component';

describe('VitalFormComponent', () => {
  let component: VitalFormComponent;
  let fixture: ComponentFixture<VitalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
