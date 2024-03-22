import { Store } from "@ngrx/store";
import { backupChoiceConfirmed, backupChoiceSelected, backupsComponentClosed, backupsComponentInit } from "@app/store/backups/backups.actions";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ContainerDefinition } from "@app/models/container";
import { getBackupChoice, getBackupsList, getBackupsLoading, getContainerDef, getInProgressRollbacks } from "./backups.selectors";
import { BackupDefinition } from "@app/models/backup";
import { InProgressRollbacks } from "./backups.reducer";

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

    public onBackupChoiceSelected(containerDef: ContainerDefinition, backupChoice: BackupDefinition): void {
        // TODO: Temporarily making this backupChoiceConfirmed to bypass the 'selected' state.
        //          Need to build the UI.
        this.store.dispatch(backupChoiceConfirmed({ containerDef, backupChoice }))
    }

    public getContainerDef$(): Observable<ContainerDefinition | null | undefined> {
        return this.store.select(getContainerDef);
    }

    public getBackupsLoading$(): Observable<boolean | undefined> {
        return this.store.select(getBackupsLoading);
    }

    public getBackupsList$(): Observable<BackupDefinition[] | undefined> {
        return this.store.select(getBackupsList);
    }

    public getBackupChoice$(): Observable<BackupDefinition | null | undefined> {
        return this.store.select(getBackupChoice);
    }

    public getInProgressRollbacks$(): Observable<InProgressRollbacks> {
        return this.store.select(getInProgressRollbacks);
    }
}

export const backupsFeatureFacades = [
    BackupsFacade,
];