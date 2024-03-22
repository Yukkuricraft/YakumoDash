import { createFeatureSelector, createSelector } from "@ngrx/store";
import { isNil } from 'lodash';
import { BackupsFeatureKey } from "@app/store/backups/feature-key";
import { BackupsFeatureState } from "@app/store/backups/backups.reducer";
import { ContainerDefinition } from "@app/models/container";

const getBackupsState = createFeatureSelector<BackupsFeatureState>(BackupsFeatureKey);

export const getComponentOpen = createSelector(
  getBackupsState,
  (state: BackupsFeatureState) => state.componentOpen,
);

export const getContainerDef = createSelector(
  getBackupsState,
  (state: BackupsFeatureState) => state.containerDef,
);

export const getBackupsLoading = createSelector(
  getBackupsState,
  getContainerDef,
  (state: BackupsFeatureState, containerDef: ContainerDefinition | null) => {
    if (containerDef === null) {
      console.warn("Tried getting loading state but containerDef state was null!");
      return false;
    } else if (Object.keys(state.backups).indexOf(containerDef.getHostname()) === -1) {
      console.warn("Tried getting loading state but containerDef was not initialized in our store state!")
      return false;
    }

    return state.backups[containerDef.getHostname()].loading;
  },
);

export const getBackupsList = createSelector(
  getBackupsState,
  getContainerDef,
  (state: BackupsFeatureState, containerDef: ContainerDefinition | null) => {
    if (containerDef === null) {
      console.warn("Tried getting backups list but containerDef state was null!");
      return [];
    } else if (Object.keys(state.backups).indexOf(containerDef.getHostname()) === -1) {
      console.warn("Tried getting backups list but containerDef was not initialized in our store state!")
      return [];
    }

    return state.backups[containerDef.getHostname()].backupsList;
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