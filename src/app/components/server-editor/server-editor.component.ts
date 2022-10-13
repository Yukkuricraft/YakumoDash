import { Component, OnInit } from "@angular/core";
import { FilesService } from "@app/services/files/files.service";

@Component({
  selector: "app-server-editor",
  templateUrl: "./server-editor.component.html",
  styleUrls: ["./server-editor.component.scss"],
})
export class ServerEditorComponent {
  constructor(private filesService: FilesService) {
    this.filesService.listFiles("env/").subscribe(console.log);
  }
}
