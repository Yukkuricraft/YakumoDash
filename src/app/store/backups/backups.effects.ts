import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ContainerDefAndBackupChoiceProp, ContainerDefProp, backupChoiceConfirmed, backupsComponentInit, backupsListInit, rollbackCompleted } from "@app/store/backups/backups.actions";
import { of } from "rxjs";
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

    public onBackupsComponentInit = createEffect(
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
                })
            )
    );

    public onBackupChoiceConfirmed = createEffect(
        () => this.actions$
            .pipe(
                ofType(backupChoiceConfirmed),
                withLatestFrom(this.backupsFacade.getBackupChoice$()),
                switchMap(([_, backupDefinition]: [any, BackupDefinition | null]) => {
                    if (backupDefinition === null) {
                        console.warn(`A backupChoiceConfirmed action was dispatched but did not get a valid backupDefinition from the store!`);
                        return of(rollbackCompleted({
                            snapshotId: null,
                            success: false,
                        }));
                    }
                    return this.backupsService.restoreBackup(backupDefinition).pipe(
                        map(({ success, output }: any) => {
                            console.log({ log: 'Output from Restore Backup API Call', output, success});
                            return rollbackCompleted({
                                snapshotId: backupDefinition.id,
                                success,
                            });
                        }),
                    )
                })
            )
    );
}

export const backupsFeatureEffects = [
    BackupsEffects,
];
