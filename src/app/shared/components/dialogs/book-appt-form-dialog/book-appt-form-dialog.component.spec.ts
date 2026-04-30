import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookApptFormDialogComponent } from './book-appt-form-dialog.component';

describe('BookApptFormDialogComponent', () => {
  let component: BookApptFormDialogComponent;
  let fixture: ComponentFixture<BookApptFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookApptFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookApptFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
