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

  editContainerConfig() {
    const env = this.env.name;
    const worldGroup = this.containerDef.getContainerNameLabel();
    const subPath = `files/${env}/minecraft/${worldGroup}`;

    // TODO: API-authorative configs...
    const isDev = window.location.hostname.indexOf("dev") > -1;
    const url = `https://${isDev ? 'dev.' : '' }files.yakumo.yukkuricraft.net/${subPath}`;
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

  copyConfigs() {
    // TODO: Dropdown select config type?
    console.log(`Copying configs back to bindmount for container in env ${this.env.getFormattedLabel()}`, this.containerDef);
    this.store.dispatch(RootActions.copyConfigsForContainerAndType({ containerDef: this.containerDef, dataFileType: DataDirType.ModConfigs }));
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
      width: "90vw",
      height: "90vh",
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbar.open("Closing console.");
      }
    });
  }
}