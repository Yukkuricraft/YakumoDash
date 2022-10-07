import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ContainerActionsComponent } from "./container-actions.component";

describe("ContainerActionsComponent", () => {
	let component: ContainerActionsComponent;
	let fixture: ComponentFixture<ContainerActionsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ContainerActionsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ContainerActionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
