import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BackupsManagementDialogComponent } from "./backup-management.component";

describe("BackupsManagementDialogComponent", () => {
  let component: BackupsManagementDialogComponent;
  let fixture: ComponentFixture<BackupsManagementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BackupsManagementDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackupsManagementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
