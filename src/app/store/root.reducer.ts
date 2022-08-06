import { initialState, RootState } from "@app/store/root.state";
import { ActionReducer, createReducer, MetaReducer, on } from "@ngrx/store";
import {
  setAvailableEnvs,
  setContainersForEnv,
  setLoggedInUser,
  setLogoutUser,
  setTabIndexForPage
} from "@app/store/root.actions";
import {
  Container,
  ContainerType,
  ContainerTypeToContainerMapping,
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
  on(setContainersForEnv,
    (state, { env, containers }): RootState => {
      let currEnvContainers: ContainerTypeToContainerMapping = state.containersByEnv[env.name] ?? {};
      let containerTypeLabel = 'net.yukkuricraft.container_type';

      for (const container of containers) {
        let containerType: ContainerType;
        if (_.includes(container.labels, `${containerTypeLabel}=minecraft`)) {
          containerType = ContainerType.Minecraft;
        } else if (_.includes(container.labels, `${containerTypeLabel}=velocity`)) {
          containerType = ContainerType.Velocity;
        } else if (_.includes(container.labels, `${containerTypeLabel}=mysql`)) {
          containerType = ContainerType.MySQL;
        } else {
          containerType = ContainerType.Unknown;
        }

        currEnvContainers[containerType] = [...(currEnvContainers[containerType] ?? []), container];
      }

      return ({
        ...state,
        containersByEnv: {
          ...state.containersByEnv,
          [env.name]: currEnvContainers,
        }
      });
    }),
  on(setTabIndexForPage, (state, { pageType, tabIndex }): RootState => {
    console.log("mmmm")
    return ({
      ...state,
      tabIndex: {
        ...state.tabIndex,
        [pageType]: tabIndex,
      },
    })
  })
);
