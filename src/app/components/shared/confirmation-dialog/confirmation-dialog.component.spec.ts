import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import {
	MAT_DIALOG_DATA,
	MatDialogContent,
	MatDialogModule,
	MatDialogRef,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

import { MatButtonHarness } from "@angular/material/button/testing";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component";

describe("ConfirmationDialogComponent", () => {
	let component: ConfirmationDialogComponent;
	let fixture: ComponentFixture<ConfirmationDialogComponent>;
	let loader: HarnessLoader;

	let dialogSpy: jasmine.SpyObj<MatDialogRef<any, boolean>>;

	const testDescription = "description test";

	beforeEach(async () => {
		dialogSpy = jasmine.createSpyObj("dialogRef", ["close"]);

		await TestBed.configureTestingModule({
			declarations: [ConfirmationDialogComponent],
			providers: [
				{ provide: MatDialogRef, useValue: dialogSpy },
				{
					provide: MAT_DIALOG_DATA,
					useValue: { description: testDescription },
				},
			],
			imports: [MatButtonModule, MatDialogModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConfirmationDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		loader = TestbedHarnessEnvironment.loader(fixture);
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("description is visible if data provided", () => {
		const dialogContent = fixture.debugElement.query(
			By.directive(MatDialogContent)
		);
		const text = dialogContent.nativeElement.innerText;
		expect(text).toEqual(testDescription);
	});

	it("description is not visible if data not provided", () => {
		component.data = undefined;
		fixture.detectChanges();

		const dialogContent = fixture.debugElement.query(
			By.directive(MatDialogContent)
		);
		const text = dialogContent.nativeElement.innerText;
		expect(text).toEqual("");
	});

	it("cancel button calls dialog ref close with false", async () => {
		const cancelButton = await loader.getHarness(
			MatButtonHarness.with({ text: "Cancel" })
		);
		await cancelButton.click();
		expect(dialogSpy.close).toHaveBeenCalledOnceWith(false);
	});

	it("ok button calls dialog ref close with true", async () => {
		const okButton = await loader.getHarness(
			MatButtonHarness.with({ text: "OK" })
		);
		await okButton.click();
		expect(dialogSpy.close).toHaveBeenCalledOnceWith(true);
	});
});
