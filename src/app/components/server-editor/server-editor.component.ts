import { Component, OnInit } from "@angular/core";
import { FileTypeBit } from "@app/models/file";
import { FilesService } from "@app/services/files/files.service";

@Component({
  selector: "app-server-editor",
  templateUrl: "./server-editor.component.html",
  styleUrls: ["./server-editor.component.scss"],
})
export class ServerEditorComponent {
  constructor(private filesService: FilesService) {
    this.filesService.listFiles("env/").subscribe(data => {
      console.log(data);
      if (data.ls[0].fileMode.fileType === FileTypeBit.REG) {
        console.log("Detected as regular filetype bit");
      }
    });
  }
}
