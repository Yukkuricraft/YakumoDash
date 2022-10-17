import { MatSnackBar } from "@angular/material/snack-bar";
import {
  ServerConsoleDialogComponent,
  ServerConsoleDialogData,
} from "@app/components/shared/server-console-dialog/server-console-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Component, Input, OnInit } from "@angular/core";
import {
  ActiveContainer,
  ContainerDefinition,
  ContainerStates,
} from "@app/models/container";
import { Env } from "@app/models/env";
import { Router } from "@angular/router";

@Component({
  selector: "app-container-actions",
  templateUrl: "./container-actions.component.html",
  styleUrls: ["./container-actions.component.scss"],
})
export class ContainerActionsComponent {
  @Input() env!: Env;
  @Input() containerDef!: ContainerDefinition;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  startContainerDisabled() {
    return this.containerDef.getContainerState() === ContainerStates.Up;
  }
  startContainer() {
    console.log("Starting container", this.containerDef);
  }

  editContainerConfig() {
    const env = this.env.name;
    const subPath = `worlds/${this.containerDef.getContainerNameLabel()}`;
    console.log("Sending to:", env, subPath);
    this.router.navigate(["/", "server-editor"], {
      queryParams: {
        env,
        subPath,
      },
    });
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
