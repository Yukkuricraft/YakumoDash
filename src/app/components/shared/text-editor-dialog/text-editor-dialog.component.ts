import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilesService } from '@app/services/files/files.service';

export type TextEditorDialogData = { title?: string; uri?: string; };

@Component({
  selector: 'app-text-editor-dialog',
  templateUrl: './text-editor-dialog.component.html',
  styleUrls: ['./text-editor-dialog.component.scss']
})
export class TextEditorDialogComponent {
  MAX_FILE_LEN = 512 * 1024; // chars, approx bytes. Do we keep this?

  options = {
    automaticLayout: true,
    theme: 'vs-dark',
    dimension: {
      height: '500px',
    },
    contextmenu: true,
    minimap: {
      enabled: true,
    }
  }

  editorContent: string = "";

  constructor(
    private fileService: FilesService,
    public dialogRef: MatDialogRef<TextEditorDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data?: TextEditorDialogData,
  ) {
    let file = data?.uri ?? 'Foo.txt';

    this.fileService.readFile(file).subscribe(
      (result: any) => {
        console.log("GOT BACK:")
        console.log(result)
        this.editorContent = result.content.toString() ?? '[]';
      }
    );
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
