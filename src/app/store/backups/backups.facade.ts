import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ContainerDefinition } from "@app/models/container";

import { backupChoiceConfirmed, backupChoiceDeselected, backupChoiceSelected, backupsComponentClosed, backupsComponentInit, createBackupButtonClicked } from "@app/store/backups/backups.actions";
import { getBackupChoice, getBackupsList, isBackupsReadyToRender, getContainerDef, getInProgressRollbacks, isBackupChoiceSelected } from "@app/store/backups/backups.selectors";
import { InProgressRollbacks } from "@app/store/backups/backups.reducer";
import { BackupDefinition } from "@app/models/backup";

@Injectable()
export class BackupsFacade {
    constructor(
        private store: Store<any>
    ) {
    }

    public onInitBackupsComponent(containerDef: ContainerDefinition): void {
        this.store.dispatch(backupsComponentInit({ containerDef }));
    }

    public onDestroyBackupsComponent(containerDef: ContainerDefinition): void {
        this.store.dispatch(backupsComponentClosed({ containerDef }));
    }

    public onCreateBackupButtonClicked(containerDef: ContainerDefinition): void {
        this.store.dispatch(createBackupButtonClicked({ containerDef }));
    }

    public onBackupChoiceSelected(containerDef: ContainerDefinition, backupChoice: BackupDefinition): void {
        this.store.dispatch(backupChoiceSelected({ containerDef, backupChoice }))
    }

    public onBackupChoiceConfirmed(containerDef: ContainerDefinition, backupChoice: BackupDefinition): void {
        this.store.dispatch(backupChoiceConfirmed({ containerDef, backupChoice }))
    }

    public onDeselectBackupChoice(containerDef: ContainerDefinition): void {
        this.store.dispatch(backupChoiceDeselected({ containerDef }));
    }

    public isBackupChoiceSelected$(): Observable<boolean> {
        return this.store.select(isBackupChoiceSelected)
    }

    public isBackupsReadyToRender$(): Observable<boolean> {
        return this.store.select(isBackupsReadyToRender);
    }

    public getContainerDef$(): Observable<ContainerDefinition | null> {
        return this.store.select(getContainerDef);
    }

    public getBackupsList$(): Observable<BackupDefinition[]> {
        return this.store.select(getBackupsList);
    }

    public getBackupChoice$(): Observable<BackupDefinition | null> {
        return this.store.select(getBackupChoice);
    }

    public getInProgressRollbacks$(): Observable<InProgressRollbacks> {
        return this.store.select(getInProgressRollbacks);
    }
}

export const backupsFeatureFacades = [
    BackupsFacade,
];