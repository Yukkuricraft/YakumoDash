import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ContainerStatusLightComponent } from "./container-status-light.component";

describe("ContainerStatusLightComponent", () => {
	let component: ContainerStatusLightComponent;
	let fixture: ComponentFixture<ContainerStatusLightComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ContainerStatusLightComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ContainerStatusLightComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
