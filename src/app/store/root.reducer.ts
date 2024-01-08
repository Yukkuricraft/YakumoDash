import { initialState, RootState } from "@app/store/root.state";
import { ActionReducer, createReducer, MetaReducer, on } from "@ngrx/store";
import {
  RootActions,
  EnvActions,
  BackupActions,
  EnvAndActiveContainersProps,
  ContainerAndBackupProps,
  EnvAndContainerDefinitionsProps,
  PageTypeAndTabIndexProps,
  EnvsProp,
  UserProp,
} from "@app/store/root.actions";
import {
  ContainerType,
  ContainerTypeToActiveContainerMapping,
  ContainerTypeToContainerDefinitionMapping,
} from "@app/models/container";

export const rootReducer = createReducer(
  initialState,
  on(RootActions.setLoggedInUser, (state: RootState, { user }: UserProp): RootState => {
    return { ...state, user };
  }),
  on(RootActions.setLogoutUser, (state: RootState): RootState => {
    return { ...state, user: null };
  }),
  on(RootActions.setGlobalLoadingBarActive, (state: RootState): RootState => {
    return { ...state, globalLoadingBarState: true };
  }),
  on(RootActions.setGlobalLoadingBarInactive, (state: RootState): RootState => {
    return { ...state, globalLoadingBarState: false };
  }),
  on(EnvActions.setAvailableEnvs, (state: RootState, { envs }: EnvsProp): RootState => {
    return { ...state, availableEnvs: envs };
  }),
  on(RootActions.setTabIndexForPage, (state: RootState, { pageType, tabIndex }: PageTypeAndTabIndexProps): RootState => {
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
    (state: RootState, { env, containers }: EnvAndContainerDefinitionsProps): RootState => {
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
    (state: RootState, { env, containers }: EnvAndActiveContainersProps): RootState => {
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
    BackupActions.setBackupsForContainer,
    (state: RootState, { containerDef, backups }: ContainerAndBackupProps): RootState => {
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
