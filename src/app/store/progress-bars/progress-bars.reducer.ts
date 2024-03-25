import { createReducer, on } from "@ngrx/store";
import { ContainerDefAndBackupChoiceProp, SnapshotIdAndContainerDefProp, SnapshotIdAndSuccessProp, backupChoiceConfirmed, rollbackCompleted, rollbackInitiated } from "@app/store/backups/backups.actions";
import { BackupDefinition } from "@app/models/backup";
import { ContainerDefinition } from "@app/models/container";
import { ContainerDefProp } from "@app/store/backups/backups.actions";
import { RootActions } from "../root/root.actions";
import { ProgressBarIdentifierProp } from "./progress-bars.actions";

export interface ProgressBarsState {
    [id: string]: Date; // Timestamp progress bar began
};

export const initialProgressBarsState: ProgressBarsState = {};

export interface ProgressBarsFeatureState {
    progressBars: ProgressBarsState;
};

export const initialProgressBarsFeatureState: ProgressBarsFeatureState = {
    progressBars: { ...initialProgressBarsState }
};




export const ProgressBarsReducer = createReducer<ProgressBarsFeatureState>(
    {...initialProgressBarsFeatureState },
    on(backupChoiceConfirmed, (state: ProgressBarsFeatureState, { backupChoice }: ContainerDefAndBackupChoiceProp) => {
        const identifier = `Rolling back: ${backupChoice.id}`;
        return {
            ...state,
            progressBars: {
                ...state.progressBars,
                [identifier]: new Date(),
            }
        };
    }),
    on(rollbackCompleted, (state: ProgressBarsFeatureState, { snapshotId }: SnapshotIdAndSuccessProp ) => {
        const identifier = `Rolling back: ${snapshotId}`;
        let newState = {
            ...state,
            progressBars: {
                ...state.progressBars,
            }
        }
        if (snapshotId !== null) {
            delete newState.progressBars[identifier];
        }
        return newState;
    }),

    // TODO: Refactor - this is plugging in legacy NGRX RootActions as a stopgap
    on(RootActions.setGlobalLoadingBarActive, (state: ProgressBarsFeatureState, { identifier }: ProgressBarIdentifierProp) => {
        return {
            ...state,
            progressBars: {
                ...state.progressBars,
                [identifier]: new Date(),
            }
        };
    }),
    on(RootActions.setGlobalLoadingBarInactive, (state: ProgressBarsFeatureState, { identifier }: ProgressBarIdentifierProp) => {
        if (identifier === "*") {
            // "Unload all progress bars - used when logging out etc"
            return { ...initialProgressBarsFeatureState };
        }

        let newState = {
            ...state,
            progressBars: {
                ...state.progressBars,
            }
        };
        console.log(`Unsetting global loading bar for: ${identifier}`);
        console.log(newState);
        delete newState.progressBars[identifier];
        return newState;
    }),
);

export const progressBarsFeatureReducer = [
    ProgressBarsReducer,
];