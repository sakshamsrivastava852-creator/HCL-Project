import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { Fields } from "./fields";

describe("Fields", () => {
  let component: Fields;
  let fixture: ComponentFixture<Fields>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fields],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Fields);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
