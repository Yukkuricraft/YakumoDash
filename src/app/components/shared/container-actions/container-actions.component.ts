import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import {
  ServerConsoleDialogComponent,
  ServerConsoleDialogData,
} from "@app/components/shared/server-console-dialog/server-console-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Component, Input, OnInit } from "@angular/core";
import {
  ActiveContainer,
  DataDirType,
  ContainerDefinition,
  ContainerStates,
} from "@app/models/container";
import { Env } from "@app/models/env";
import { Router } from "@angular/router";
import { RootActions, EnvActions } from "@app/store/root/root.actions";
import { selectActiveContainerByContainerDef } from "@app/store/root/root.selectors.containers";
import { map, Observable, switchMap, BehaviorSubject } from "rxjs";
import { BackupsManagementDialogComponent, BackupsManagementDialogData, BackupsManagementDialogReturn } from "@app/components/backup-management/backup-management.component";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-container-actions",
  templateUrl: "./container-actions.component.html",
  styleUrls: ["./container-actions.component.scss"],
})
export class ContainerActionsComponent {
  @Input() env!: Env;
  @Input() containerDef!: ContainerDefinition;

  activeContainer$!: Observable<ActiveContainer | null>;

  containerRunning$: BehaviorSubject<boolean>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar,
    private store: Store,
  ) {
    this.containerRunning$ = new BehaviorSubject(true);
  }

  ngOnInit() {
    this.activeContainer$ = this.store.select(selectActiveContainerByContainerDef(this.containerDef));

    this.activeContainer$.subscribe(
      (activeContainer: ActiveContainer | null) => {
        console.log(activeContainer);

        if (activeContainer === null) {
          this.containerRunning$.next(false);
        } else {
          this.containerRunning$.next(activeContainer.getContainerState() == ContainerStates.Up);
        }
      }
    )
  }

  startContainer() {
    console.log(`Starting container in env ${this.env.getFormattedLabel()}`, this.containerDef);
    this.store.dispatch(EnvActions.beginSpinupContainer({ containerDef: this.containerDef }));
  }

  editContainerConfig(containerDef: ContainerDefinition) {
    const env = this.env.name;

    let subPath;
    if (containerDef.isMinecraftContainer) {
      const worldGroup = this.containerDef.getContainerNameLabel();
      subPath = `files/${env}/minecraft/${worldGroup}`;
    } else if (containerDef.isVelocityContainer) {
      subPath = `files/${env}/velocity`;
    }

    const url = `${environment.PROTOCOL}://${environment.FILEBROWSER_HOST}/${subPath}`;
    console.log("Sending to:", env, url);

    window.open(url, "_blank");
  }

  manageBackups() {
    const env = this.env.name;
    console.log("Sending to:", env, this.containerDef);

    const dialogRef = this.dialog.open<
      BackupsManagementDialogComponent,
      BackupsManagementDialogData,
      BackupsManagementDialogReturn
    >(BackupsManagementDialogComponent, {
      data: {
        containerDef: this.containerDef,
        containerRunning$: this.containerRunning$,
      },
      width: "85vw",
      height: "85vh",
      panelClass: 'backups-mat-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  stopContainer() {
    console.log(`Stopping container in env ${this.env.getFormattedLabel()}`, this.containerDef);
    this.store.dispatch(EnvActions.beginShutdownContainer({ containerDef: this.containerDef }));
  }

  openServerConsole() {
    console.log("Nyooom");
    if (this.env === null) {
      return;
    }

    const activeEnv = this.env as Env;
    console.log(activeEnv);
    const dialogRef = this.dialog.open<
      ServerConsoleDialogComponent,
      ServerConsoleDialogData,
      boolean
    >(ServerConsoleDialogComponent, {
      data: {
        env: activeEnv,
        containerDef: this.containerDef,
      },
      width: "95vw",
      height: "95vh",
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbar.open("Closing console.", "Ok");
      }
    });
  }
}