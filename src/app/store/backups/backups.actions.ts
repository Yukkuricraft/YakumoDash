import { BackupDefinition } from "@app/models/backup";
import { ContainerDefinition } from "@app/models/container";
import { createAction, props } from "@ngrx/store";

const moduleName = 'Backups';

export interface ContainerDefProp {
    containerDef: ContainerDefinition;
};

export interface ContainerDefAndMessageProp {
    containerDef: ContainerDefinition;
    message: string;
};

export interface ContainerDefAndBackupsListProp {
    containerDef: ContainerDefinition;
    backupsList: BackupDefinition[];
};

export interface ContainerDefAndBackupChoiceProp {
    containerDef: ContainerDefinition;
    backupChoice: BackupDefinition;
};

export interface ContainerDefAndWorldListProp {
    containerDef: ContainerDefinition;
    worlds: string[];
};

export interface ContainerDefAndBackupChoiceAndWorldsAndBypassProp {
    containerDef: ContainerDefinition;
    backupChoice: BackupDefinition;
    worlds: string[];
    bypassRunningContainerRestriction: boolean;
};

export interface DialogIdProp {
    dialogId: string;
};

export interface BackupDefProp {
    backupDef: BackupDefinition;
};

export interface NullableBackupDefAndMessageProp {
    backupDef: BackupDefinition | null;
    message: string;
};

export const backupsComponentInit = createAction(
    `[${moduleName}][Component] Backups Component Initialized`,
    props<ContainerDefProp>(),
);

export const backupsComponentClosed = createAction(
    `[${moduleName}][Component] Backups Component closed`,
    props<ContainerDefProp>(),
);

export const backupsListInit = createAction(
    `[${moduleName}][Component] Backups list initialized`,
    props<ContainerDefAndBackupsListProp>()
);


export const createBackupButtonClicked = createAction(
    `[${moduleName}][Create] Create backup button clicked`,
    props<ContainerDefProp>(),
);

export const backupCreationSuccessful = createAction(
    `[${moduleName}][Create] Successfully created new backup`,
    props<ContainerDefProp>(),
);

export const backupCreationFailed = createAction(
    `[${moduleName}][Create] Failed creating new backup`,
    props<ContainerDefAndMessageProp>(),
);


export const backupChoiceDeselected = createAction(
    `[${moduleName}][Restore] Backup choice was deselected`,
    props<ContainerDefProp>(),
);

export const backupChoiceSelected = createAction(
    `[${moduleName}][Restore] Backup choice was selected`,
    props<ContainerDefAndBackupChoiceProp>(),
);

export const backupChoiceWorldsInit = createAction(
    `[${moduleName}][Restore] Backup choice's world list has been initialized`,
    props<ContainerDefAndWorldListProp>(),
)

export const backupChoiceConfirmed = createAction(
    `[${moduleName}][Restore] Backup choice was confirmed`,
    props<ContainerDefAndBackupChoiceAndWorldsAndBypassProp>(),
);

export const rollbackSuccessful = createAction(
    `[${moduleName}][Restore] Successfully restored from backup`,
    props<BackupDefProp>(),
);

export const rollbackFailed = createAction(
    `[${moduleName}][Restore] Failed to restore from backup`,
    props<NullableBackupDefAndMessageProp>(),
);