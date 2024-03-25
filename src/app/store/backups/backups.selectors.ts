import { createFeatureSelector, createSelector } from "@ngrx/store";
import { isNil } from 'lodash';
import { BackupsFeatureKey } from "@app/store/backups/feature-key";
import { BackupsFeatureState } from "@app/store/backups/backups.reducer";
import { ContainerDefinition } from "@app/models/container";
import { BackupDefinition } from "@app/models/backup";

const getBackupsState = createFeatureSelector<BackupsFeatureState>(BackupsFeatureKey);

export const isComponentOpen = createSelector(
  getBackupsState,
  (state: BackupsFeatureState) => state.componentOpen,
);

export const getContainerDef = createSelector(
  getBackupsState,
  (state: BackupsFeatureState) => state.containerDef,
);

export const getBackupsList = createSelector(
  getBackupsState,
  getContainerDef,
  (state: BackupsFeatureState, containerDef: ContainerDefinition | null) => {
    console.log("getBackupsList");
    if (containerDef === null) {
      console.warn("Tried getting backups list but containerDef state was null!");
      return [];
    } else if (Object.keys(state.backups).indexOf(containerDef.getHostname()) === -1) {
      console.warn("Tried getting backups list but containerDef was not initialized in our store state!")
      return [];
    }

    console.log("Returning backups list");
    return state.backups[containerDef.getHostname()].backupsList;
  },
);

export const isBackupsReadyToRender = createSelector(
  getBackupsState,
  getContainerDef,
  (state: BackupsFeatureState, containerDef: ContainerDefinition | null) => {
    const containerHostname = containerDef?.getHostname() ?? "";
    console.log({msg: "isBackupsReadyToRender", state, containerDef });
    if (containerDef === null) {
      console.warn("Tried getting loading state but containerDef state was null!");
      return false;
    } else if (Object.keys(state.backups).indexOf(containerHostname) === -1) {
      console.warn("Tried getting loading state but containerDef was not initialized in our store state!")
      return false;
    }

    const backupsState = state.backups[containerHostname];


    if (backupsState.backupsList.length > 0) {
      console.log("Defaulting to true")
      // We'll allow rendering if we have cached backups.
      return true;
    }

    console.log("Returning backupsState.loading");
    return !backupsState.loading;
  },
);

export const getBackupChoice = createSelector(
  getBackupsState,
  getContainerDef,
  (state: BackupsFeatureState, containerDef: ContainerDefinition | null) => {
    if (containerDef === null) {
      console.warn("Tried getting backup choice but containerDef state was null!");
      return null;
    } else if (Object.keys(state.backups).indexOf(containerDef.getHostname()) === -1) {
      console.warn("Tried getting backup choice but containerDef was not initialized in our store state!")
      return null;
    }

    return state.backups[containerDef.getHostname()].backupChoice;
  },
);


export const getInProgressRollbacks = createSelector(
  getBackupsState,
  (state: BackupsFeatureState) => state.rollbacks,
);

export const isBackupChoiceSelected = createSelector(
  getBackupChoice,
  (backupDef: BackupDefinition | null) => {
    return backupDef !== null;
  },
);
