import { Component } from '@angular/core';
import { DockerService } from "@app/services/docker/docker.service";
import { EnvironmentsService } from "@app/services/environments/environments.service";
import { Store } from "@ngrx/store";
import { map, Observable, switchMap } from "rxjs";
import {
  selectAvailableEnvs,
  selectCurrentTabIndex, selectDefinedContainersByEnvAndType
} from "@app/store/root.selectors";
import { Env } from "@app/models/env";
import { fetchAvailableEnvs, fetchContainerStatusForEnv, setTabIndexForPage } from "@app/store/root.actions";
import { ContainerType } from "@app/models/container";
import { MatDialog } from "@angular/material/dialog";
import { NewEnvironmentDialogComponent } from "@app/components/server-management/subcomponents/new-environment-dialog/new-environment-dialog.component";
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  activeEnv: Env | null = null;

  constructor(
    public dialog: MatDialog,
    private store: Store,
    private dockerApi: DockerService,
    private snackbar: MatSnackBar,
    private envsApi: EnvironmentsService,
    
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
        this.activeEnv = env;
        this.refreshContainersForEnv(env);
      }
    )
  }

  refreshContainersForEnv(env: Env): void {
    console.log(`Refreshing containers for ${env.getFormattedLabel()}`);
    this.store.dispatch(fetchContainerStatusForEnv({ env }));
  }

  openNewEnvDialog(): void {
    this.dialog.open(NewEnvironmentDialogComponent, { width: '500px' })
  }

  getDefinedContainersForEnvAndType$(env: Env, type: ContainerType) {
    return this.store.select(selectDefinedContainersByEnvAndType(env, type));
  }

  selectedIndexChanged(tabIndex: number) {
    this.store.dispatch(setTabIndexForPage({ pageType: this.pageType, tabIndex }));
  }

  // Env Actions
  startEnvironment() {
    if (this.activeEnv === null) {
      return;
    }
    const activeEnv = this.activeEnv as Env;
    console.log("UPPING ENV", activeEnv)
    
    this.dockerApi.upEnv(activeEnv).subscribe(
      (data) => {
        this.snackbar.open(`Servers for env '${activeEnv.getFormattedLabel()}' started.`);
        console.log(data);
        this.refreshContainersForEnv(activeEnv);
      }
    );
  }
  startEnvironmentDisabled() {
    return false;
  }

  stopEnvironment() {
    if (this.activeEnv === null) {
      return;
    }

    const activeEnv = this.activeEnv as Env;
    const dialogRef = this.dialog.open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        data: { 
          title: 'Confirm Shutdown of Environment',
          description: `This action will stop all containers and servers for the environment '${activeEnv.getFormattedLabel()}'.`
        },
        width: '300px',
      },
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dockerApi.downEnv(activeEnv).subscribe(
          (data) =>  {
            this.snackbar.open(`Servers for env '${activeEnv.getFormattedLabel()}' stopped.`);
            console.log(data);
            this.refreshContainersForEnv(activeEnv);
          }
        );
      }
    });
  }
  stopEnvironmentDisabled() {
    return false;
  }

  restartEnvironment() {
    if (this.activeEnv === null) {
      return;
    }

    const activeEnv = this.activeEnv as Env;
    console.log("RESTARTING ENV", activeEnv)
    this.dockerApi.restartEnv(activeEnv).subscribe(
      console.log
    );
  }
  restartEnvironmentDisabled() {
    return false;
  }

  deleteEnvironment() {
    if (this.activeEnv === null) {
      return;
    }

    const activeEnv = this.activeEnv as Env;
    const dialogRef = this.dialog.open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        data: { 
          title: 'Confirm Environment Deletion',
          description: `This action will delete the environment '${activeEnv.getFormattedLabel()}'. Are you sure?`
        },
        width: '300px',
      },
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dockerApi.deleteEnv(activeEnv).subscribe(
          (data) => {
            this.snackbar.open(`Env '${activeEnv.getFormattedLabel()}' successfully deleted`);
            console.log(data);
            this.store.dispatch(fetchAvailableEnvs());
          }
        )
      }
    });
  }
}
