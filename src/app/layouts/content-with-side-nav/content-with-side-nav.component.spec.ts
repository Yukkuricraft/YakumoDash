import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ContentWithSideNavComponent } from "./content-with-side-nav.component";

describe("ContentWithSideNavComponent", () => {
	let component: ContentWithSideNavComponent;
	let fixture: ComponentFixture<ContentWithSideNavComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ContentWithSideNavComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ContentWithSideNavComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
