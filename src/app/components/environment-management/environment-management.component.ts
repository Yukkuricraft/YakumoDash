import { Component, AfterViewInit } from "@angular/core";
import { DockerService } from "@app/services/docker/docker.service";
import { EnvironmentsService } from "@app/services/environments/environments.service";
import { Store } from "@ngrx/store";
import { map, Observable, switchMap } from "rxjs";
import {
  selectAvailableEnvs,
  selectCurrentTabIndex,
} from "@app/store/root/root.selectors";
import { selectDefinedContainersByEnvAndType } from "@app/store/root/root.selectors.containers";
import { Env } from "@app/models/env";
import {
  RootActions,
  EnvActions,
} from "@app/store/root/root.actions";
import { ContainerType } from "@app/models/container";
import { MatDialog } from "@angular/material/dialog";
import { NewEnvironmentDialogComponent } from "@app/components/environment-management/subcomponents/new-environment-dialog/new-environment-dialog.component";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from "../shared/confirmation-dialog/confirmation-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  TextEditorDialogComponent,
  TextEditorDialogData,
  TextEditorDialogReturn,
} from "../shared/text-editor-dialog/text-editor-dialog.component";
import { isNil } from "lodash-es";

@Component({
  selector: "app-server-management",
  templateUrl: "./environment-management.component.html",
  styleUrls: ["./environment-management.component.scss"],
})
export class EnvironmentManagementComponent implements AfterViewInit {
  ContainerType = ContainerType;

  pageType: string = "EnvironmentManagement";
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
      switchMap(tabIndex =>
        this.availableEnvs$.pipe(map(envs => envs[tabIndex ?? 0]))
      )
    );

    this.activeEnv$.subscribe(env => {
      this.activeEnv = env;

      if (!isNil(env)) {
        this.refreshContainersForEnv(env);
      }
    });
  }

  ngAfterViewInit() {
    const tabsHeader = document.getElementsByTagName("mat-tab-header")[0];
    tabsHeader.addEventListener("wheel", (e: any) => {
      tabsHeader.scrollLeft += e.deltaY;
      e.preventDefault();
    });
  }

  refreshContainersForEnv(env: Env): void {
    console.log(`Refreshing containers for ${env.getFormattedLabel()}`);
    this.store.dispatch(RootActions.fetchContainerStatusForEnv({ env }));
  }

  openNewEnvDialog(): void {
    this.dialog.open(NewEnvironmentDialogComponent);
  }

  getDefinedContainersForEnvAndType$(env: Env, type: ContainerType) {
    return this.store.select(selectDefinedContainersByEnvAndType(env, type));
  }

  selectedIndexChanged(tabIndex: number) {
    this.store.dispatch(
      RootActions.setTabIndexForPage({ pageType: this.pageType, tabIndex })
    );
  }

  // Env Actions
  startEnvironment() {
    if (this.activeEnv === null) {
      return;
    }
    const activeEnv = this.activeEnv as Env;
    this.store.dispatch(EnvActions.beginSpinupEnv({ env: activeEnv }));
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
        title: "Confirm Shutdown of Environment",
        description: `This action will stop all containers (servers) for the environment '${activeEnv.getFormattedLabel()}'.`,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbar.open(
          "This might take a bit to complete. Girls are preparing.",
          "Ok"
        );
        this.store.dispatch(EnvActions.beginShutdownEnv({ env: activeEnv }));
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
    console.log("RESTARTING ENV", activeEnv);
    this.dockerApi.restartEnv(activeEnv).subscribe(console.log);
  }

  restartEnvironmentDisabled() {
    return true;
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
        title: "Edit Environment Config",
        uri: `gen/env-toml/${activeEnv.name}.toml`,
        extraActionPrompt: `Would you like to disable regenerating all env configs after saving? (You must regenerate configs to reflect changes in the UI)`,
      },
      width: "95vw",
      height: "85vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.result) {
        if (result?.extraActionResult) {
          // 'True - disable regenerating configs'
          // Just reinitialize
          console.log(result);
          this.reinitializeApp();
        } else {
          // 'False - don't disable regenerating configs'
          // Regenerate, THEN reinitialize
          this.envsApi.regenerateEnvConfigs(activeEnv).subscribe(result => {
            console.log(result);
            this.reinitializeApp();
          });
        }
      }
    });
  }

  reinitializeApp() {
    this.store.dispatch(RootActions.initializeApp());
  }

  isDeleteEnvironmentDisabled() {
    return false;
  }

  deleteEnvironment() {
    if (this.activeEnv === null) {
      return;
    } else if (this.activeEnv.enableEnvProtection) {
      this.snackbar.open(
        `Env Protection is enabled on ${this.activeEnv.formatted}. Disable it in the env configs before deleting this env.`
      );
      return;
    }

    const activeEnv = this.activeEnv as Env;
    const dialogRef = this.dialog.open<
      ConfirmationDialogComponent,
      ConfirmationDialogData,
      boolean
    >(ConfirmationDialogComponent, {
      data: {
        title: "Confirm Environment Deletion",
        description: `<p>This action will PERMANENTLY delete the environment <b>${activeEnv.getFormattedLabel()}</b>.</p>
				<br />
				<p>This action is <b>PERMANENT AND IRREVERSIBLE</b>. All files and configs will be lost.</p>
				<br />
				<p><i>Are you sure?</i></p>`,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(EnvActions.beginDeleteEnv({ env: activeEnv }));
      }
    });
  }
}
