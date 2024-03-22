import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ContainerDefAndBackupChoiceProp, ContainerDefProp, backupChoiceConfirmed, backupsComponentInit, backupsListInit, rollbackCompleted } from "@app/store/backups/backups.actions";
import { map, switchMap, mergeMap } from "rxjs/operators";
import { BackupsService, RestoreBackupApiResponse } from "@app/services/backups/backups.service";
import { BackupDefinition } from "@app/models/backup";


@Injectable()
export class BackupsEffects {

    constructor(
        private actions$: Actions,
        private backupsService: BackupsService,
    ) {
    }

    public onBackupsComponentInit = createEffect(
        () => this.actions$
            .pipe(
                ofType(backupsComponentInit),
                switchMap(({ containerDef }: ContainerDefProp) => {
                    return this.backupsService.listBackups(containerDef).pipe(
                        map((backupsList: BackupDefinition[]) => {
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
                switchMap(({ backupChoice }: ContainerDefAndBackupChoiceProp) => {
                    return this.backupsService.restoreBackup(backupChoice).pipe(
                        map(({ success, output }: any) => {
                            console.log({ log: 'Output from Restore Backup API Call', output, success});
                            return rollbackCompleted({
                                snapshotId: backupChoice.id,
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
