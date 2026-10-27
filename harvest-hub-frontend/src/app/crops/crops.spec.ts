import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { Crops } from "./crops";

describe("Crops", () => {
  let component: Crops;
  let fixture: ComponentFixture<Crops>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Crops],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Crops);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
