import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ContainerDefAndBackupChoiceProp, ContainerDefProp, backupChoiceConfirmed, backupCreationFailed, backupCreationSuccessful, backupsComponentInit, backupsListInit, createBackupButtonClicked, rollbackFailed, rollbackSuccessful } from "@app/store/backups/backups.actions";
import { of, catchError, EMPTY } from "rxjs";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { BackupsService, RestoreBackupApiResponse } from "@app/services/backups/backups.service";
import { BackupDefinition } from "@app/models/backup";
import { BackupsFacade } from "./backups.facade";


@Injectable()
export class BackupsEffects {

    constructor(
        private actions$: Actions,
        private backupsService: BackupsService,
        private backupsFacade: BackupsFacade,
    ) {
    }

    public getBackupsList$ = createEffect(
        () => this.actions$
            .pipe(
                ofType(backupsComponentInit),
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
                }),
            )
    );

    public restoreBackup$ = createEffect(
        () => this.actions$
            .pipe(
                ofType(backupChoiceConfirmed),
                withLatestFrom(this.backupsFacade.getBackupChoice$()),
                switchMap(([_, backupDef]: [any, BackupDefinition | null]) => {
                    if (backupDef === null) {
                        console.warn(`A backupChoiceConfirmed action was dispatched but did not get a valid backupDefinition from the store!`);
                        return of(rollbackFailed({
                            backupDef,
                        }));
                    }
                    return this.backupsService.restoreBackup(backupDef).pipe(
                        map(({ success, output }: any) => {
                            console.log({ log: 'Output from Restore Backup API Call', output, success});
                            if (success) {
                                return rollbackSuccessful({
                                    backupDef,
                                });
                            } else {
                                return rollbackFailed({
                                    backupDef,
                                });
                            }
                        }),
                        catchError((error: Error) => {
                            console.warn(error);
                            return of(rollbackFailed({
                                backupDef,
                            }))
                        }),
                    )
                })
            )
    );

    public createNewBackup$ = createEffect(
        () => this.actions$
            .pipe(
                ofType(createBackupButtonClicked),
                switchMap(({ containerDef }: ContainerDefProp) => {
                    console.log("createNewBackup$");
                    return this.backupsService.createBackup(containerDef).pipe(
                        map(({ success, output }: any) => {
                            console.log({ log: 'Output from Create Backup API Call', output, success});
                            if (success) {
                                return backupCreationSuccessful({
                                    containerDef,
                                })
                            } else {
                                return backupCreationFailed({
                                    containerDef,
                                })
                            }
                        }),
                        catchError((error: Error) => {
                            console.warn(error);
                            return of(backupCreationFailed({
                                containerDef,
                            }))
                        })
                    );
                }),
            ),
        { dispatch: false }
    );
}

export const backupsFeatureEffects = [
    BackupsEffects,
];
