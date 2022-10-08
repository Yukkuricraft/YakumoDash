import { initialState, RootState } from "@app/store/root.state";
import { ActionReducer, createReducer, MetaReducer, on } from "@ngrx/store";
import {
  EnvActions,
  setGlobalLoadingBarActive,
  setGlobalLoadingBarInactive,
  setLoggedInUser,
  setLogoutUser,
  setTabIndexForPage,
} from "@app/store/root.actions";
import {
  ContainerType,
  ContainerTypeToActiveContainerMapping,
  ContainerTypeToContainerDefinitionMapping,
} from "@app/models/container";

export const rootReducer = createReducer(
  initialState,
  on(setLoggedInUser, (state, { user }): RootState => {
    return { ...state, user };
  }),
  on(setLogoutUser, (state): RootState => {
    return { ...state, user: null };
  }),
  on(setGlobalLoadingBarActive, (state): RootState => {
    return { ...state, globalLoadingBarState: true };
  }),
  on(setGlobalLoadingBarInactive, (state): RootState => {
    return { ...state, globalLoadingBarState: false };
  }),
  on(EnvActions.setAvailableEnvs, (state, { envs }): RootState => {
    return { ...state, availableEnvs: envs };
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
  on(setTabIndexForPage, (state, { pageType, tabIndex }): RootState => {
    return {
      ...state,
      tabIndex: {
        ...state.tabIndex,
        [pageType]: tabIndex,
      },
    };
  })
);
