import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { FieldOperations } from "./field-operations";

describe("FieldOperations", () => {
  let component: FieldOperations;
  let fixture: ComponentFixture<FieldOperations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldOperations],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FieldOperations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
