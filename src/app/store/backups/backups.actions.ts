import { BackupDefinition } from "@app/models/backup";
import { ContainerDefinition } from "@app/models/container";
import { createAction, props } from "@ngrx/store";
import { ProgressBarIdentifierProp } from "../progress-bars/progress-bars.actions";

const moduleName = 'Backups';

export interface ContainerDefProp {
    containerDef: ContainerDefinition;
};

export interface ContainerDefAndBackupsListProp {
    containerDef: ContainerDefinition;
    backupsList: BackupDefinition[];
};

export interface ContainerDefAndBackupChoiceProp {
    containerDef: ContainerDefinition;
    backupChoice: BackupDefinition;
};

export interface DialogIdProp {
    dialogId: string;
};

export interface RollbackStatusProp {
    success: boolean;
};

export interface SnapshotIdAndContainerDefProp {
    snapshotId: string;
    containerDef: ContainerDefinition;
};

export interface SnapshotIdAndSuccessProp {
    snapshotId: string | null;
    success: boolean;
};

export const backupsComponentInit = createAction(
    `[${moduleName}] Backups Component Initialized`,
    props<ContainerDefProp>(),
);

export const backupsComponentClosed = createAction(
    `[${moduleName}] Backups Component closed`,
    props<ContainerDefProp>(),
);

export const backupsListInit = createAction(
    `[${moduleName}] Backups list initialized`,
    props<ContainerDefAndBackupsListProp>()
);

export const backupChoiceDeselected = createAction(
    `[${moduleName}] Backup choice was deselected`,
    props<ContainerDefProp>(),
);

export const backupChoiceSelected = createAction(
    `[${moduleName}] Backup choice was selected`,
    props<ContainerDefAndBackupChoiceProp>(),
);

export const backupChoiceConfirmed = createAction(
    `[${moduleName}] Backup choice was confirmed`,
    props<ContainerDefAndBackupChoiceProp>(),
);

export const rollbackInitiated = createAction(
    `[${moduleName}] Rollback Initiated`,
    props<SnapshotIdAndContainerDefProp>(),
);

export const rollbackCompleted = createAction(
    `[${moduleName}] Rollback Completed`,
    props<SnapshotIdAndSuccessProp>(),
);