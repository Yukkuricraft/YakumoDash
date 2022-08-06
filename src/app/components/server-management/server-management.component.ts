import { Component, OnInit } from '@angular/core';
import { DockerService } from "@app/services/docker/docker.service";
import { EnvironmentsService } from "@app/services/environments/environments.service";
import { Store } from "@ngrx/store";
import { map, Observable, of, switchMap, tap } from "rxjs";
import {
  selectAvailableEnvs,
  selectContainersByEnv,
  selectContainersByEnvAndType,
  selectCurrentTabIndex
} from "@app/store/root.selectors";
import { Env } from "@app/models/env";
import { setContainersForEnv, setTabIndexForPage } from "@app/store/root.actions";
import { ContainerType } from "@app/models/container";

@Component({
  selector: 'app-server-management',
  templateUrl: './server-management.component.html',
  styleUrls: ['./server-management.component.scss']
})
export class ServerManagementComponent {
  ContainerType = ContainerType;

  pageType: string = 'ServerManagement';
  availableEnvs$: Observable<Env[]>;

  activeTabIndex$!: Observable<number | undefined>;
  activeEnv$!: Observable<Env>;

  constructor(private store: Store, private dockerApi: DockerService, private envsApi: EnvironmentsService) {
    this.availableEnvs$ = this.store.select(selectAvailableEnvs);
    this.activeTabIndex$ = this.store.select(selectCurrentTabIndex(this.pageType))
    this.activeEnv$ = this.activeTabIndex$.pipe(
      switchMap((tabIndex) => this.availableEnvs$.pipe(
        map(envs => envs[tabIndex ?? 0])
      ))
    )
  }

  updateContainersForEnv() {
    this.activeEnv$.subscribe(
      (env) => {
        this.dockerApi.list(env).subscribe(
          (containers) => this.store.dispatch(setContainersForEnv({ env, containers }))
        )
      }
    )
  }

  listContainers(env: Env) {
    this.dockerApi.list(env).subscribe(
      (data) => {
        console.log(data)
      }
    )
  }

  getContainersForEnvAndType(env: Env, type: ContainerType) {
    return this.store.select(selectContainersByEnvAndType(env, type));
  }

  selectedIndexChanged(tabIndex: number) {
    this.store.dispatch(setTabIndexForPage({ pageType: this.pageType, tabIndex }));
    this.updateContainersForEnv();
  }
}
