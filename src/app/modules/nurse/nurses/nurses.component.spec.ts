import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { NursesComponent } from "./nurses.component";

describe("NursesComponent", () => {
  let component: NursesComponent;
  let fixture: ComponentFixture<NursesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NursesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
