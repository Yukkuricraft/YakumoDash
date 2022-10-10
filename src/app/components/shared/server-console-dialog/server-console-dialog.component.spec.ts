import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ServerConsoleDialogComponent } from "./server-console-dialog.component";

describe("ContainerStatusComponent", () => {
  let component: ServerConsoleDialogComponent;
  let fixture: ComponentFixture<ServerConsoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServerConsoleDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServerConsoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
