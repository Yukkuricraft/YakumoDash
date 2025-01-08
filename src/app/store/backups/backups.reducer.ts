import { createReducer, on } from "@ngrx/store";
import { BackupDefProp, ContainerDefAndBackupChoiceProp, ContainerDefAndBackupsListProp, ContainerDefAndWorldListProp, backupChoiceConfirmed, backupChoiceDeselected, backupChoiceSelected, backupChoiceWorldsInit, backupsComponentClosed, backupsComponentInit, backupsListInit, rollbackSuccessful } from "@app/store/backups/backups.actions";
import { BackupDefinition } from "@app/models/backup";
import { ContainerDefinition } from "@app/models/container";
import { ContainerDefProp } from "@app/store/backups/backups.actions";

export interface InProgressRollbacks {
    [snapshotId: string]: ContainerDefinition,
};

export interface BackupsState {
    loadingBackupsList: boolean,
    loadingBackupChoiceWorldsList: boolean,
    backupsList: BackupDefinition[],
    backupChoice: BackupDefinition | null,
    backupChoiceWorldsList: string[]
};

export const initialContainerBackupsState: BackupsState = {
    loadingBackupsList: false,
    loadingBackupChoiceWorldsList: false,
    backupsList: [],
    backupChoice: null,
    backupChoiceWorldsList: [],
};

export interface ContainerToBackupsState {
    [containerName: string]: BackupsState,
};

export interface BackupsFeatureState {
    componentOpen: boolean,
    containerDef: ContainerDefinition | null,
    backups: ContainerToBackupsState,
    rollbacks: InProgressRollbacks,
};

export const initialBackupFeatureState: BackupsFeatureState = {
    componentOpen: false,
    containerDef: null,
    backups: {},
    rollbacks: {},
}

export const BackupsReducer = createReducer<BackupsFeatureState>(
    {...initialBackupFeatureState },
    on(backupsComponentInit, (state: BackupsFeatureState, { containerDef }: ContainerDefProp) => {
        const containerHostname = containerDef.getHostname();
        let currBackupState = { ...initialContainerBackupsState };
        if (Object.keys(state.backups).indexOf(containerHostname) !== -1) {
            currBackupState = {
                ...state.backups[containerHostname],
            }
        }
        return {
            ...state,
            componentOpen: true,
            containerDef,
            backups: {
                ...state.backups,
                [containerHostname]: {
                    ...currBackupState,
                    loadingBackupsList: true,
                }
            }
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
                    loadingBackupChoiceWorldsList: false,
                    loadingBackupsList: false,
                    backupChoice: null,
                    backupChoiceWorldsList: [],
                }
            }
        };
    }),
    on(backupsListInit, (state: BackupsFeatureState, { containerDef, backupsList }: ContainerDefAndBackupsListProp) => {
        const containerHostname = containerDef.getHostname();
        console.log(`Updating backups list for ${containerHostname}`);
        const sortedBackups = [ ...backupsList ];
        sortedBackups.sort(
            (a, b) => b.time.getTime() - a.time.getTime()
        );

        return {
            ...state,
            backups: {
                ...state.backups,
                [containerHostname]: {
                    ...state.backups[containerHostname],
                    backupsList: sortedBackups,
                    loadingBackupsList: false,
                }
            },
        };
    }),
    on(backupChoiceSelected, (state: BackupsFeatureState, { containerDef, backupChoice }: ContainerDefAndBackupChoiceProp) => {
        const containerHostname = containerDef.getHostname();
        return {
            ...state,
            backups: {
                ...state.backups,
                [containerHostname]: {
                    ...state.backups[containerHostname],
                    backupChoice,
                    backupChoiceWorldsList: [],
                    loadingBackupChoiceWorldsList: true,
                }
            },
        };
    }),
    on(backupChoiceWorldsInit, (state: BackupsFeatureState, { containerDef, worlds }: ContainerDefAndWorldListProp) => {
        const containerHostname = containerDef.getHostname();

        return {
            ...state,
            backups: {
                ...state.backups,
                [containerHostname]: {
                    ...state.backups[containerHostname],
                    loadingBackupChoiceWorldsList: false,
                    backupChoiceWorldsList: worlds,
                }
            }
        }
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
                    backupChoiceWorldsList: [],
                },
            },
        };
    }),
    on(
        backupChoiceConfirmed,
        (state: BackupsFeatureState) => {
            console.log("Rollback initiated or backup choice confirmed");
            const containerDef = state.containerDef;
            if (containerDef === null) {
                console.warn(`Tried initiating rollback but state.containerDef was not set!`);
                return {
                    ...state,
                };
            }
            const containerHostname = containerDef.getHostname();
            const backupDef = state.backups[containerHostname].backupChoice
            if (backupDef === null) {
                console.warn(`Tried initiating rollback but state.backups[containerHostname].backupChoice was not set!`);
                return {
                    ...state,
                };
            }
            const snapshotId = backupDef.id;

            console.log("SETTING ROLLBACK INITIATED")
            console.log({ containerDef, backupDef, snapshotId})
            return {
                ...state,
                rollbacks: {
                    ...state.rollbacks,
                    [snapshotId]: containerDef,
                },
            };
        }
    ),
    on(rollbackSuccessful, (state: BackupsFeatureState, { backupDef }: BackupDefProp ) => {
        let newState = {
            ...state,
            rollbacks: {
                ...state.rollbacks,
            }
        }
        const snapshotId = backupDef?.id;
        if (snapshotId  !== null) {
            delete newState.rollbacks[snapshotId];
        }
        return newState;
    }),
);

export const backupsFeatureReducer = [
    BackupsReducer,
];