import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { CropPlans } from "./crop-plans";

describe("CropPlans", () => {
  let component: CropPlans;
  let fixture: ComponentFixture<CropPlans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropPlans],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CropPlans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
