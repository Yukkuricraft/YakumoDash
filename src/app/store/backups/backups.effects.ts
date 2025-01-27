import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  NullableBackupDefAndMessageProp,
  ContainerDefProp,
  backupChoiceConfirmed,
  backupCreationFailed,
  backupCreationSuccessful,
  backupsComponentInit,
  backupsListInit,
  createBackupButtonClicked,
  rollbackFailed,
  rollbackSuccessful,
  BackupDefProp,
  ContainerDefAndMessageProp,
  backupChoiceSelected,
  ContainerDefAndBackupChoiceProp,
  backupChoiceWorldsInit,
  ContainerDefAndBackupChoiceAndWorldsAndBypassProp,
} from "@app/store/backups/backups.actions";
import { of, tap, catchError, EMPTY } from "rxjs";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import {
  BackupsService,
  RestoreBackupApiResponse,
} from "@app/services/backups/backups.service";
import { BackupDefinition } from "@app/models/backup";
import { BackupsFacade } from "./backups.facade";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class BackupsEffects {
  constructor(
    private actions$: Actions,
    private backupsService: BackupsService,
    private backupsFacade: BackupsFacade,
    private snackbar: MatSnackBar
  ) {}

  public getBackupsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(backupsComponentInit, backupCreationSuccessful),
      switchMap(({ containerDef }: ContainerDefProp) => {
        console.log("Backup component initialized");
        console.log(containerDef);
        return this.backupsService.listBackups(containerDef).pipe(
          map((backupsList: BackupDefinition[]) => {
            console.log("Backups from API:");
            console.log(backupsList);
            return backupsListInit({ containerDef, backupsList });
          })
        );
      }),
      catchError((error: Error) => {
        console.warn(error);
        return EMPTY;
      })
    )
  );

  public getSnapshotWorldsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(backupChoiceSelected),
      switchMap(
        ({ containerDef, backupChoice }: ContainerDefAndBackupChoiceProp) => {
          console.log("Getting worlds list for backup");
          console.log(backupChoice);
          return this.backupsService.listSnapshotWorlds(backupChoice).pipe(
            map((worlds: string[]) => {
              return backupChoiceWorldsInit({ containerDef, worlds });
            })
          );
        }
      )
    )
  );

  public restoreBackup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(backupChoiceConfirmed),
      withLatestFrom(this.backupsFacade.getBackupChoice$()),
      switchMap(
        ([{ worlds, bypassRunningContainerRestriction }, backupDef]: [
          ContainerDefAndBackupChoiceAndWorldsAndBypassProp,
          BackupDefinition | null
        ]) => {
          if (backupDef === null) {
            const message = `A backupChoiceConfirmed action was dispatched but did not get a valid backupDefinition from the store!`;
            console.warn(message);
            return of(
              rollbackFailed({
                backupDef,
                message,
              })
            );
          }
          return this.backupsService
            .restoreBackup(backupDef, worlds, bypassRunningContainerRestriction)
            .pipe(
              map(({ success, output }: any) => {
                console.log({
                  log: "Output from Restore Backup API Call",
                  output,
                  success,
                });
                if (success) {
                  return rollbackSuccessful({
                    backupDef,
                  });
                } else {
                  return rollbackFailed({
                    backupDef,
                    message: output,
                  });
                }
              }),
              catchError((error: Error) => {
                console.warn(error);
                return of(
                  rollbackFailed({
                    backupDef,
                    message: error?.message ?? "No Error Message Provided",
                  })
                );
              })
            );
        }
      )
    )
  );

  public displayRollbackSuccessSnackbar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(rollbackSuccessful),
        tap(({ backupDef }: BackupDefProp) => {
          this.snackbar.open(
            `Successfullly rolled back ${
              backupDef.hostname
            } to ${backupDef.time.toLocaleString()}`,
            "Ok"
          );
        })
      ),
    { dispatch: false }
  );
  public displayRollbackFailedSnackbar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(rollbackFailed),
        tap(({ message }: NullableBackupDefAndMessageProp) => {
          this.snackbar.open(message, "Ok");
        })
      ),
    { dispatch: false }
  );

  public createNewBackup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createBackupButtonClicked),
      switchMap(({ containerDef }: ContainerDefProp) => {
        console.log("createNewBackup$");
        return this.backupsService.createBackup(containerDef).pipe(
          map(({ success, output }: any) => {
            console.log({
              log: "Output from Create Backup API Call",
              output,
              success,
            });
            if (success) {
              return backupCreationSuccessful({
                containerDef,
              });
            } else {
              return backupCreationFailed({
                containerDef,
                message: output,
              });
            }
          }),
          catchError((error: Error) => {
            console.warn(error);
            return of(
              backupCreationFailed({
                containerDef,
                message: error?.message ?? "No Error Message Provided",
              })
            );
          })
        );
      })
    )
  );

  public displayBackupSuccessSnackbar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(backupCreationSuccessful),
        tap(({ containerDef }: ContainerDefProp) => {
          this.snackbar.open(
            `Successfullly created backup for ${containerDef.getHostname()}`,
            "Ok"
          );
        })
      ),
    { dispatch: false }
  );
  public displayBackupFailedSnackbar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(backupCreationFailed),
        tap(({ message }: ContainerDefAndMessageProp) => {
          this.snackbar.open(message, "Ok");
        })
      ),
    { dispatch: false }
  );
}

export const backupsFeatureEffects = [BackupsEffects];
