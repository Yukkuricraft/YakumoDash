import { MatSnackBar } from "@angular/material/snack-bar";
import {
  ServerConsoleDialogComponent,
  ServerConsoleDialogData,
} from "./../server-console-dialog/server-console-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Component, Input, OnInit } from "@angular/core";
import {
  ActiveContainer,
  ContainerDefinition,
  ContainerStates,
} from "@app/models/container";
import { Env } from "@app/models/env";

@Component({
  selector: "app-container-actions",
  templateUrl: "./container-actions.component.html",
  styleUrls: ["./container-actions.component.scss"],
})
export class ContainerActionsComponent {
  @Input() env!: Env;
  @Input() containerDef!: ContainerDefinition;

  constructor(private dialog: MatDialog, private snackbar: MatSnackBar) {}

  startContainerDisabled() {
    return this.containerDef.getContainerState() === ContainerStates.Up;
  }
  startContainer() {
    console.log("Starting container", this.containerDef);
  }

  editContainerConfig() {
    console.log("Hm?");
  }

  restartContainerDisabled() {
    return this.containerDef.getContainerState() !== ContainerStates.Up;
  }
  restartContainer() {
    console.log("Restarting container", this.containerDef);
  }

  openServerConsole() {
    console.log("Nyooom");
    if (this.env === null) {
      return;
    }

    const activeEnv = this.env as Env;
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
