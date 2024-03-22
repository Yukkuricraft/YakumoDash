import { createReducer, on } from "@ngrx/store";
import { ContainerDefAndBackupChoiceProp, ContainerDefAndBackupsListProp, SnapshotIdAndContainerDefProp, SnapshotIdAndSuccessProp, backupChoiceDeselected, backupChoiceSelected, backupsComponentClosed, backupsComponentInit, backupsListInit, rollbackCompleted, rollbackInitiated } from "@app/store/backups/backups.actions";
import { BackupDefinition } from "@app/models/backup";
import { ContainerDefinition } from "@app/models/container";
import { ContainerDefProp } from "@app/store/backups/backups.actions";

export interface InProgressRollbacks {
    [snapshotId: string]: ContainerDefinition,
};

export interface BackupsState {
    loading: boolean,
    backupsList: BackupDefinition[],
    backupChoice: BackupDefinition | null,
};

export interface ContainerBackupsState {
    [containerName: string]: BackupsState
};

export interface BackupsFeatureState {
    componentOpen: boolean,
    containerDef: ContainerDefinition | null,
    backups: ContainerBackupsState,
    rollbacks: InProgressRollbacks,
};

export const initialBackupsState: BackupsFeatureState = {
    componentOpen: false,
    containerDef: null,
    backups: {},
    rollbacks: {},
}

export const BackupsReducer = createReducer<BackupsFeatureState>(
    {...initialBackupsState },
    on(backupsComponentInit, (state: BackupsFeatureState, { containerDef }: ContainerDefProp) => {
        return {
            ...state,
            componentOpen: true,
            containerDef,
        }
    }),
    on(backupsComponentClosed, (state: BackupsFeatureState, { containerDef }: ContainerDefProp) => {
        const containerHostname = containerDef.getHostname();
        return {
            ...state,
            componentOpen: false,
            containerDef: null,
            backups: {
                ...state.backups,
                [containerHostname]: {
                    ...state.backups[containerHostname],
                    backupChoice: null,
                }
            }
        };
    }),
    on(backupsListInit, (state: BackupsFeatureState, { containerDef, backupsList }: ContainerDefAndBackupsListProp) => {
        const containerHostname = containerDef.getHostname();
        return {
            ...state,
            backups: {
                ...state.backups,
                [containerHostname]: {
                    ...state.backups[containerHostname],
                    backupsList,
                }
            },
        };
    }),
    on(backupChoiceSelected, (state: BackupsFeatureState, { containerDef, backupChoice }: ContainerDefAndBackupChoiceProp) => {
        const containerHostname = containerDef.getHostname();
        console.log("asdf");
        console.log(containerHostname);
        return {
            ...state,
            backups: {
                ...state.backups,
                [containerHostname]: {
                    ...state.backups[containerHostname],
                    backupChoice,
                }
            },
        };
    }),
    on(backupChoiceDeselected, (state: BackupsFeatureState, { containerDef }: ContainerDefProp) => {
        const containerHostname = containerDef.getHostname();
        return {
            ...state,
            backups: {
                ...state.backups,
                [containerHostname]: {
                    ...state.backups[containerHostname],
                    backupChoice: null,
                },
            },
        };
    }),
    on(rollbackInitiated, (state: BackupsFeatureState, { snapshotId, containerDef }: SnapshotIdAndContainerDefProp ) => {
        return {
            ...state,
            rollbacks: {
                ...state.rollbacks,
                [snapshotId]: containerDef,
            },
        };
    }),
    on(rollbackCompleted, (state: BackupsFeatureState, { snapshotId }: SnapshotIdAndSuccessProp ) => {
        let newState = {
            ...state,
        }
        if (snapshotId  !== null) {
            delete newState.rollbacks[snapshotId];
        }
        return newState;
    }),
);

export const backupsFeatureReducer = [
    BackupsReducer,
];