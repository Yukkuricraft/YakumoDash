import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ContainerStatusCardComponent } from "./container-status-card.component";

describe("ContainerStatusComponent", () => {
  let component: ContainerStatusCardComponent;
  let fixture: ComponentFixture<ContainerStatusCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContainerStatusCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
