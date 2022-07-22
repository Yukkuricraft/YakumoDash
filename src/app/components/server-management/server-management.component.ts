import { Component, OnInit } from '@angular/core';
import { DockerService } from "@app/services/docker/docker.service";
import { EnvironmentsService } from "@app/services/environments/environments.service";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { selectAvailableEnvsFormatted } from "@app/store/root.selectors";

@Component({
  selector: 'app-server-management',
  templateUrl: './server-management.component.html',
  styleUrls: ['./server-management.component.scss']
})
export class ServerManagementComponent {
  availableEnvs$: Observable<string[]>;

  constructor(private store: Store, private dockerApi: DockerService, private envsApi: EnvironmentsService) {
    this.availableEnvs$ = this.store.select(selectAvailableEnvsFormatted);
  }

  listContainers(env: string) {
    this.dockerApi.list(env).subscribe(
      (data) => {
        console.log(data)
      }
    )
  }

  listEnvs() {
    this.envsApi.listEnvsWithConfigs().subscribe(
      (data) => {
      }
    )
  }
}
