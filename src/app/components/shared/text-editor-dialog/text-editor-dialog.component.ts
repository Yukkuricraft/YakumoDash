import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FilesService } from "@app/services/files/files.service";

export type TextEditorDialogData = {
	title?: string;
	uri?: string;
	extraActionPrompt?: string;
};

export type TextEditorDialogReturn = {
	result: boolean;
	extraActionResult: boolean | null;
};

@Component({
	selector: "app-text-editor-dialog",
	templateUrl: "./text-editor-dialog.component.html",
	styleUrls: ["./text-editor-dialog.component.scss"],
})
export class TextEditorDialogComponent {
	MAX_FILE_LEN = 512 * 1024; // chars, approx bytes. Do we keep this?

	options = {
		automaticLayout: true,
		theme: "vs-dark",
		wordWrap: true,
		contextmenu: true,
		minimap: {
			enabled: true,
		},
	};

	filename: string = "";
	editorContent: string = "";
	extraActionValue: boolean | null = null;

	constructor(
		private fileService: FilesService,
		public dialogRef: MatDialogRef<
			TextEditorDialogComponent,
			TextEditorDialogReturn
		>,
		@Inject(MAT_DIALOG_DATA) public data?: TextEditorDialogData
	) {
		let file = data?.uri ?? "Foo.txt";

		this.fileService.readFile(file).subscribe((result: any) => {
			this.filename = file;
			console.log("GOT BACK:");
			console.log(result);
			this.editorContent = result.content.toString() ?? "[]";
		});
	}

	onCancel() {
		this.dialogRef.close({
			result: false,
			extraActionResult: this.extraActionValue,
		});
	}

	onSave() {
		console.log(this.editorContent);
		this.fileService
			.writeFile(this.filename, this.editorContent)
			.subscribe(console.log);
		this.dialogRef.close({
			result: true,
			extraActionResult: this.extraActionValue,
		});
	}
}
