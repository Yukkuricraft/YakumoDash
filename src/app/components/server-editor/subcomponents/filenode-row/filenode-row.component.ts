import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  TextEditorDialogComponent,
  TextEditorDialogData,
  TextEditorDialogReturn,
} from "@app/components/shared/text-editor-dialog/text-editor-dialog.component";
import { FileNode } from "@app/models/file";

@Component({
  selector: "app-filenode-row",
  templateUrl: "./filenode-row.component.html",
  styleUrls: ["./filenode-row.component.scss"],
})
export class FilenodeRowComponent {
  @Input() fileNode!: FileNode;

  constructor(private dialog: MatDialog) {}

  openFile() {
    const pathString = this.fileNode.pathString;

    const dialogRef = this.dialog.open<
      TextEditorDialogComponent,
      TextEditorDialogData,
      TextEditorDialogReturn
    >(TextEditorDialogComponent, {
      data: {
        title: `Edit ${pathString}`,
        uri: pathString,
      },
      width: "100vw",
      height: "90vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.result) {
        console.log("aaa?");
      }
    });
  }
}
