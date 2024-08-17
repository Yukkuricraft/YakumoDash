import { Component, OnInit } from "@angular/core";
import { DockerService } from "@app/services/docker/docker.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  RootActions,
  EnvActions,
} from "@app/store/root/root.actions";
import { Store } from "@ngrx/store";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from "@app/components/shared/confirmation-dialog/confirmation-dialog.component";
import { Env } from "@app/models/env";

interface ServerType {
  name: string;
  id: string;
  hint: string;
}

@Component({
  selector: "app-new-environment-dialog",
  templateUrl: "./new-environment-dialog.component.html",
  styleUrls: ["./new-environment-dialog.component.scss"],
})
export class NewEnvironmentDialogComponent {
  MIN_ALIAS_LEN = 3;
  MAX_ALIAS_LEN = 32;

  MAX_DESCRIPTION_LEN = 2048;

  // TODO: This really should be supplied by the yc-api rather than hardcoded in the frontend.
  MIN_PORT = 25600;
  MAX_PORT = 25700;
  // MIN_PORT = 26600;
  // MAX_PORT = 26700;

  numbersReg = /^\d+$/;

  form: FormGroup;

  get envAlias() {
    return this.form.controls["envAlias"] as FormControl;
  }
  get description() {
    return this.form.controls["description"] as FormControl;
  }
  get proxyPort() {
    return this.form.controls["proxyPort"] as FormControl;
  }
  get serverType() {
    return this.form.controls["serverType"] as FormControl;
  }
  get enableEnvProtection() {
    return this.form.controls["enableEnvProtection"] as FormControl;
  }

  constructor(
    private dockerApi: DockerService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private store: Store,
    private dialogRef: MatDialogRef<NewEnvironmentDialogComponent>
  ) {
    this.form = new FormGroup({
      envAlias: new FormControl("", [
        Validators.required,
        Validators.minLength(this.MIN_ALIAS_LEN),
        Validators.maxLength(this.MAX_ALIAS_LEN),
      ]),
      description: new FormControl("", [
        Validators.maxLength(this.MAX_DESCRIPTION_LEN),
      ]),
      proxyPort: new FormControl("", [
        Validators.required,
        Validators.min(this.MIN_PORT),
        Validators.max(this.MAX_PORT),
        Validators.pattern(this.numbersReg),
      ]),
      serverType: new FormControl(""),
      enableEnvProtection: new FormControl(""),
    });
  }

  // TODO: This doesn't handle min/max errors with different cutoff vals.
  errorMessages = {
    minlength: `You must enter a value longer than ${this.MIN_ALIAS_LEN} chars!`,
    maxlength: `You must enter a value shorter than ${this.MAX_ALIAS_LEN} chars!`,
    required: "You must enter a value!",
    min: `You must enter a value larger than ${this.MIN_PORT}!`,
    max: `You must enter a value smaller than ${this.MAX_PORT}!`,
    pattern: "You must enter a numeric value!",
  };

  serverTypes: ServerType[] = [
    { name: "Paper", id: "PAPER", hint: "Spins up a Paper server with Velocity compatibility settings preconfigured" },
    { name: "Fabric", id: "FABRIC", hint: "Spins up a Fabric server with (eventually) Velocity comaptibility mods automatically installed" },
    { name: "Custom", id: "CUSTOM", hint: "You can use any type supported by itzg/minecraft-server but you'll need to manually configure it" },
  ];

  getErrorMessage(formControl: FormControl) {
    console.log(formControl);
    for (const [error, errorMessage] of Object.entries(this.errorMessages)) {
      if (formControl.hasError(error)) {
        return errorMessage;
      }
    }

    return "Unknown error!";
  }

  createNewEnv() {
    const proxyPort = this.proxyPort?.value ?? null;
    const envAlias = this.envAlias?.value ?? null;
    if (proxyPort === null) {
      throw Error("Proxy port form not defined.");
    } else if (envAlias === null) {
      throw Error("EnvAlias form not defined.");
    }

    if (this.proxyPort?.invalid) {
      throw Error(this.getErrorMessage(this.proxyPort));
    } else if (this.envAlias?.invalid) {
      throw Error(this.getErrorMessage(this.envAlias));
    }

    const dialogRef = this.dialog.open<
      ConfirmationDialogComponent,
      ConfirmationDialogData,
      boolean
    >(ConfirmationDialogComponent, {
      data: {
        title: "Confirm New Environment Creation",
        description: `<p>You are about to create a new environment called <b>${envAlias}</b> running on port <b>${proxyPort}</b>.</p>
          <br/>
          <p>Are you sure?</p>`,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(
          EnvActions.beginCreateNewEnv({
            proxyPort: parseInt(proxyPort),
            envAlias,
            description: this.description.value,
            serverType: this.serverType.value?.id,
            enableEnvProtection: this.enableEnvProtection.value,
          })
        );
        this.dialogRef.close();
      }
    });
  }
}
