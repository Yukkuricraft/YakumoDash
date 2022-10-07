import { Component } from '@angular/core';
import { DockerService } from '@app/services/docker/docker.service';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import { Store } from '@ngrx/store';
import { map, Observable, switchMap } from 'rxjs';
import {
  selectAvailableEnvs,
  selectCurrentTabIndex,
  selectDefinedContainersByEnvAndType,
} from '@app/store/root.selectors';
import { Env } from '@app/models/env';
import {
  fetchAvailableEnvs,
  fetchContainerStatusForEnv,
  setGlobalLoadingBarActive,
  setGlobalLoadingBarInactive,
  setTabIndexForPage,
  beginDeleteEnv,
  beginSpinupEnv,
  beginShutdownEnv,
  initializeApp,
} from '@app/store/root.actions';
import { ContainerType } from '@app/models/container';
import { MatDialog } from '@angular/material/dialog';
import { NewEnvironmentDialogComponent } from '@app/components/server-management/subcomponents/new-environment-dialog/new-environment-dialog.component';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../shared/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  TextEditorDialogComponent,
  TextEditorDialogData,
  TextEditorDialogReturn,
} from '../shared/text-editor-dialog/text-editor-dialog.component';
import _ from 'lodash';

@Component({
  selector: 'app-server-management',
  templateUrl: './server-management.component.html',
  styleUrls: ['./server-management.component.scss'],
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
    private envsApi: EnvironmentsService
  ) {
    this.availableEnvs$ = this.store.select(selectAvailableEnvs);
    this.activeTabIndex$ = this.store.select(
      selectCurrentTabIndex(this.pageType)
    );

    this.activeEnv$ = this.activeTabIndex$.pipe(
      switchMap((tabIndex) =>
        this.availableEnvs$.pipe(map((envs) => envs[tabIndex ?? 0]))
      )
    );

    this.activeEnv$.subscribe((env) => {
      this.activeEnv = env;

      if (!_.isNil(env)) {
        this.refreshContainersForEnv(env);
      }
    });
  }

  refreshContainersForEnv(env: Env): void {
    console.log(`Refreshing containers for ${env.getFormattedLabel()}`);
    this.store.dispatch(fetchContainerStatusForEnv({ env }));
  }

  openNewEnvDialog(): void {
    this.dialog.open(NewEnvironmentDialogComponent, { width: '500px' });
  }

  getDefinedContainersForEnvAndType$(env: Env, type: ContainerType) {
    return this.store.select(selectDefinedContainersByEnvAndType(env, type));
  }

  selectedIndexChanged(tabIndex: number) {
    this.store.dispatch(
      setTabIndexForPage({ pageType: this.pageType, tabIndex })
    );
  }

  // Env Actions
  startEnvironment() {
    if (this.activeEnv === null) {
      return;
    }
    const activeEnv = this.activeEnv as Env;
    this.store.dispatch(beginSpinupEnv({ env: activeEnv }));
  }
  startEnvironmentDisabled() {
    return false;
  }

  stopEnvironment() {
    if (this.activeEnv === null) {
      return;
    }

    const activeEnv = this.activeEnv as Env;
    const dialogRef = this.dialog.open<
      ConfirmationDialogComponent,
      ConfirmationDialogData,
      boolean
    >(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Shutdown of Environment',
        description: `This action will stop all containers and servers for the environment '${activeEnv.getFormattedLabel()}'.`,
      },
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(beginShutdownEnv({ env: activeEnv }));
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
    console.log('RESTARTING ENV', activeEnv);
    this.dockerApi.restartEnv(activeEnv).subscribe(console.log);
  }
  restartEnvironmentDisabled() {
    return false;
  }

  editEnvironment() {
    if (this.activeEnv === null) {
      return;
    }

    const activeEnv = this.activeEnv as Env;
    console.log(activeEnv);

    const dialogRef = this.dialog.open<
      TextEditorDialogComponent,
      TextEditorDialogData,
      TextEditorDialogReturn
    >(TextEditorDialogComponent, {
      data: {
        title: 'Edit Environment Config',
        uri: `env/${activeEnv.name}.toml`,
        extraActionPrompt: `Would you like to regenerate all env configs after saving?`,
      },
      width: '100vw',
      height: '90vh',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.result) {
        // Regenerate, THEN reinitialize
        if (result?.extraActionResult) {
          this.envsApi.regenerateEnvConfigs(activeEnv).subscribe((result) => {
            console.log(result);
            this.reinitializeApp();
          });
        } else {
          // Just reinitialize
          console.log(result);
          this.reinitializeApp();
        }
      }
    });
  }

  reinitializeApp() {
    this.store.dispatch(initializeApp());
  }

  deleteEnvironment() {
    if (this.activeEnv === null) {
      return;
    }

    const activeEnv = this.activeEnv as Env;
    const dialogRef = this.dialog.open<
      ConfirmationDialogComponent,
      ConfirmationDialogData,
      boolean
    >(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Environment Deletion',
        description: `This action will PERMANENTLY delete the environment '${activeEnv.getFormattedLabel()}'. Are you sure?`,
      },
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(beginDeleteEnv({ env: activeEnv }));
      }
    });
  }
}
