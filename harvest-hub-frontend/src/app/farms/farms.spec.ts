import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { Farms } from "./farms";

describe("Farms", () => {
  let component: Farms;
  let fixture: ComponentFixture<Farms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Farms],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Farms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
