import { initialState, RootState } from "@app/store/root.state";
import { ActionReducer, createReducer, MetaReducer, on } from "@ngrx/store";
import {
  RootActions,
  EnvActions,
  BackupActions,
} from "@app/store/root.actions";
import {
  ContainerType,
  ContainerTypeToActiveContainerMapping,
  ContainerTypeToContainerDefinitionMapping,
} from "@app/models/container";
import { EnvToBackupsMapping } from "@app/models/backup";

export const rootReducer = createReducer(
  initialState,
  on(RootActions.setLoggedInUser, (state, { user }): RootState => {
    return { ...state, user };
  }),
  on(RootActions.setLogoutUser, (state): RootState => {
    return { ...state, user: null };
  }),
  on(RootActions.setGlobalLoadingBarActive, (state): RootState => {
    return { ...state, globalLoadingBarState: true };
  }),
  on(RootActions.setGlobalLoadingBarInactive, (state): RootState => {
    return { ...state, globalLoadingBarState: false };
  }),
  on(EnvActions.setAvailableEnvs, (state, { envs }): RootState => {
    return { ...state, availableEnvs: envs };
  }),
  on(RootActions.setTabIndexForPage, (state, { pageType, tabIndex }): RootState => {
    return {
      ...state,
      tabIndex: {
        ...state.tabIndex,
        [pageType]: tabIndex,
      },
    };
  }),
  on(
    EnvActions.setDefinedContainersForEnv,
    (state, { env, containers }): RootState => {
      let currEnvContainers: ContainerTypeToContainerDefinitionMapping = {};

      for (const container of containers) {
        let containerType: ContainerType = container.labelsToContainerType(
          container.labels
        );
        currEnvContainers[containerType] = [
          ...(currEnvContainers[containerType] ?? []),
          container,
        ];
      }

      return {
        ...state,
        definedContainersByEnv: {
          ...state.definedContainersByEnv,
          [env.name]: currEnvContainers,
        },
      };
    }
  ),
  on(
    EnvActions.setActiveContainersForEnv,
    (state, { env, containers }): RootState => {
      let currEnvContainers: ContainerTypeToActiveContainerMapping = {};

      for (const container of containers) {
        let containerType: ContainerType = container.labelsToContainerType(
          container.labels
        );
        currEnvContainers[containerType] = [
          ...(currEnvContainers[containerType] ?? []),
          container,
        ];
      }

      return {
        ...state,
        activeContainersByEnv: {
          ...state.activeContainersByEnv,
          [env.name]: currEnvContainers,
        },
      };
    }
  ),
  on(
    BackupActions.setBackupsForEnvAndContainer,
    (state, { containerDef, backups }): RootState => {
      return {
        ...state,
        backupsByContainerAndEnv: {
          ...state.backupsByContainerAndEnv,
          [containerDef.getContainerEnvString()]: {
            ...state.backupsByContainerAndEnv[containerDef.getContainerEnvString()],
            [containerDef.getContainerNameShorthand()]: backups,
          }
        }
      }


    }
  )
);
