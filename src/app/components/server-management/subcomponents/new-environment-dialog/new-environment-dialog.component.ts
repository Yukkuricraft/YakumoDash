import { Component, OnInit } from '@angular/core';
import { DockerService } from "@app/services/docker/docker.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-new-environment-dialog',
  templateUrl: './new-environment-dialog.component.html',
  styleUrls: ['./new-environment-dialog.component.scss']
})
export class NewEnvironmentDialogComponent {
  envAlias = "";
  proxyPort: number | null = null;

  constructor(private dockerApi: DockerService) { }

  createNewEnv() {
    if (this.proxyPort === null) {
      throw Error("Must specify a valid port.")
    }
    this.dockerApi.createEnv(this.proxyPort, this.envAlias).subscribe(console.log)
  }
}
