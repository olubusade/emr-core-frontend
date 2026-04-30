import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalNoteFormComponent } from './clinical-note-form.component';

describe('ClinicalNoteFormComponent', () => {
  let component: ClinicalNoteFormComponent;
  let fixture: ComponentFixture<ClinicalNoteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalNoteFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
