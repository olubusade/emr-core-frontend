import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AdminViewComponent } from "./admin-view.component";
describe("AdminViewComponent", () => {
  let component: AdminViewComponent;
  let fixture: ComponentFixture<AdminViewComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AdminViewComponent],
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
