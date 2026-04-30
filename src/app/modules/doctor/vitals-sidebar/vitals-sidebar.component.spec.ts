import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsSidebarComponent } from './vitals-sidebar.component';

describe('VitalsSidebarComponent', () => {
  let component: VitalsSidebarComponent;
  let fixture: ComponentFixture<VitalsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VitalsSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
