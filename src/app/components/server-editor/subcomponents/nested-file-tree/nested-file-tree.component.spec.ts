import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NestedFileTreeComponent } from "./nested-file-tree.component";

describe("NestedFileTreeComponent", () => {
  let component: NestedFileTreeComponent;
  let fixture: ComponentFixture<NestedFileTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NestedFileTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NestedFileTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
