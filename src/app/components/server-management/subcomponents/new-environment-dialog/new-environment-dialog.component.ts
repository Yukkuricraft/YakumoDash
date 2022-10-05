import { Component, OnInit } from '@angular/core';
import { DockerService } from "@app/services/docker/docker.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { initializeApp } from '@app/store/root.actions';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { Env } from '@app/models/env';

@Component({
  selector: 'app-new-environment-dialog',
  templateUrl: './new-environment-dialog.component.html',
  styleUrls: ['./new-environment-dialog.component.scss']
})
export class NewEnvironmentDialogComponent {
  MIN_PORT = 25600;
  MAX_PORT = 25700;

  numbersReg = /\d+/;

  form: FormGroup;

  get envAlias() { return this.form.controls['envAlias'] as FormControl; }

  get proxyPort() { return this.form.controls['proxyPort'] as FormControl; }

  constructor(
    private dockerApi: DockerService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private store: Store,
    private dialogRef: MatDialogRef<NewEnvironmentDialogComponent>,
  ) {
    this.form = new FormGroup({
      envAlias: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      proxyPort: new FormControl('', [
        Validators.required,
        Validators.min(this.MIN_PORT),
        Validators.max(this.MAX_PORT),
        Validators.pattern(this.numbersReg),
      ])
    });
  }

  errorMessages = {
    required: 'You must enter a value!',
    min: `You must enter a value larger than ${this.MIN_PORT}!`,
    max: `You must enter a value smaller than ${this.MAX_PORT}!`,
    pattern: 'You must enter a numeric value!',
  }

  getErrorMessage(formControl: FormControl) {
    for(const [error, errorMessage] of Object.entries(this.errorMessages)) {
      if (formControl.hasError(error)) {
        return errorMessage;
      }
    }

    return 'Unknown error!';
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

    const dialogRef = this.dialog.open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        data: {
          title: 'Confirm New Environment Creation',
          description: `You are about to create a new environment called '${envAlias}' running on port '${proxyPort}'. Are you sure?`
        },
        width: '300px',
      },
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dockerApi.createEnv(parseInt(proxyPort), envAlias).subscribe(
          (data) => {
            console.log(data);
            this.snackbar.open(`Environment '${envAlias}' successfully created on port ${proxyPort}!`);
            this.store.dispatch(initializeApp());
            this.dialogRef.close();
          }
        );
      }
    });
  }
}
