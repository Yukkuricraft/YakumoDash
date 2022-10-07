import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewEnvironmentDialogComponent } from "./new-environment-dialog.component";

describe("NewEnvironmentDialogComponent", () => {
	let component: NewEnvironmentDialogComponent;
	let fixture: ComponentFixture<NewEnvironmentDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NewEnvironmentDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NewEnvironmentDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
