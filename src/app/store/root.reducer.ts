import { initialState, RootState } from "@app/store/root.state";
import { ActionReducer, createReducer, MetaReducer, on } from "@ngrx/store";
import {
  setActiveContainersForEnv,
  setAvailableEnvs, setDefinedContainersForEnv,
  setLoggedInUser,
  setLogoutUser,
  setTabIndexForPage
} from "@app/store/root.actions";
import {
  ContainerType, ContainerTypeToActiveContainerMapping, ContainerTypeToContainerDefinitionMapping,
} from "@app/models/container";
import _ from "lodash";


export const rootReducer = createReducer(
  initialState,
  on(setLoggedInUser, (state, { user }): RootState => {
    return ({ ...state, user });
  }),
  on(setLogoutUser, (state): RootState => { return ({ ...state, user: null }) }),
  on(setAvailableEnvs, (state, { envs }): RootState => {
    return ({ ...state, availableEnvs: envs });
  }),
  on(setDefinedContainersForEnv,
    (state, { env, containers }): RootState => {
      let currEnvContainers: ContainerTypeToContainerDefinitionMapping = {};

      for (const container of containers) {
        let containerType: ContainerType = container.labelsToContainerType(container.labels);
        currEnvContainers[containerType] = [...(currEnvContainers[containerType] ?? []), container];
      }

      return ({
        ...state,
        definedContainersByEnv: {
          ...state.definedContainersByEnv,
          [env.name]: currEnvContainers,
        }
      });
    }
  ),
  on(setActiveContainersForEnv,
    (state, { env, containers }): RootState => {
      let currEnvContainers: ContainerTypeToActiveContainerMapping = {};

      for (const container of containers) {
        let containerType: ContainerType = container.labelsToContainerType(container.labels);
        currEnvContainers[containerType] = [...(currEnvContainers[containerType] ?? []), container];
      }

      console.log(`UPDATING CONTAINER STATE FOR ENV: ${env.getFormattedLabel()}`);
      console.log(currEnvContainers);
      return ({
        ...state,
        activeContainersByEnv: {
          ...state.activeContainersByEnv,
          [env.name]: currEnvContainers,
        }
      });
    }),
  on(setTabIndexForPage, (state, { pageType, tabIndex }): RootState => {
    return ({
      ...state,
      tabIndex: {
        ...state.tabIndex,
        [pageType]: tabIndex,
      },
    })
  })
);
