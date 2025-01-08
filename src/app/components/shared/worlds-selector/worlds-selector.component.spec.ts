import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorldsSelectorComponent } from "./worlds-selector.component";

describe("WorldsSelectorComponent", () => {
  let component: WorldsSelectorComponent;
  let fixture: ComponentFixture<WorldsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorldsSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorldsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
