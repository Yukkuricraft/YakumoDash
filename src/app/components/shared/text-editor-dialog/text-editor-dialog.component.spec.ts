import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TextEditorDialogComponent } from "./text-editor-dialog.component";

describe("TextEditorDialogComponent", () => {
	let component: TextEditorDialogComponent;
	let fixture: ComponentFixture<TextEditorDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TextEditorDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TextEditorDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
