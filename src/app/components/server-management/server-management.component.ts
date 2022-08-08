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
import { MatDialog } from "@angular/material/dialog";
import { NewEnvironmentDialogComponent } from "@app/components/server-management/subcomponents/new-environment-dialog/new-environment-dialog.component";

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

  constructor(
    public dialog: MatDialog,
    private store: Store,
    private dockerApi: DockerService,
    private envsApi: EnvironmentsService
  ) {
    this.availableEnvs$ = this.store.select(selectAvailableEnvs);
    this.activeTabIndex$ = this.store.select(selectCurrentTabIndex(this.pageType))

    this.activeEnv$ = this.activeTabIndex$.pipe(
      switchMap((tabIndex) => this.availableEnvs$.pipe(
        map(envs => envs[tabIndex ?? 0])
      ))
    )

    this.activeEnv$.subscribe(
      (env) => {
        this.dockerApi.listActive(env).subscribe(
          (containers) => {
            this.store.dispatch(setContainersForEnv({ env, containers }))
          }
        )
      }
    )
  }

  openNewEnvDialog(): void {
    this.dialog.open(NewEnvironmentDialogComponent, { width: '500px' })
  }

  getContainersForEnvAndType$(env: Env, type: ContainerType) {
    return this.store.select(selectContainersByEnvAndType(env, type));
  }

  selectedIndexChanged(tabIndex: number) {
    this.store.dispatch(setTabIndexForPage({ pageType: this.pageType, tabIndex }));
  }
}
