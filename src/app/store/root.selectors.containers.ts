import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RootState } from "@app/store/root.state";
import { Features } from "@app/store/index";
import { Env } from "@app/models/env";
import {
  ActiveContainer,
  ContainerDefinition,
  ContainerType,
} from "@app/models/container";
import { has, isNil, includes } from "lodash";

const selectRootState = createFeatureSelector<RootState>(Features.Root);

/** Active Containers */
export const selectActiveContainersByEnv = (env: Env) =>
  createSelector(
    selectRootState,
    (state: RootState) => state.activeContainersByEnv[env.name] || []
  );

export const selectActiveContainersByEnvAndType = (
  env: Env,
  type: ContainerType
) =>
  createSelector(selectRootState, (state: RootState) => {
    const containersInEnv = state.activeContainersByEnv[env.name];
    if (!containersInEnv || !has(containersInEnv, type)) {
      return [];
    }
    return containersInEnv[type];
  });

export const selectActiveContainerByContainerDef = (
  containerDef: ContainerDefinition
) => {
  const env = containerDef.env;
  const type = containerDef.getContainerType();
  const name = containerDef.getContainerNameLabel();

  return createSelector(
    selectActiveContainerByEnvTypeAndName(
      env,
      type,
      name
    ),
    container => container
  );
};

export const selectActiveContainerByEnvTypeAndName = (
  env: Env,
  type: ContainerType,
  name: string
) =>
  createSelector(selectActiveContainersByEnvAndType(env, type), (containers: ActiveContainer[]) => {
    if (isNil(containers)) {
      return null;
    }
    for (let container of containers) {
      if (includes(container.labels, `${container.NameLabel}=${name}`)) {
        return container;
      }
    }
    return null;
  });

/** Defined Containers */
export const selectDefinedContainersByEnv = (env: Env) =>
  createSelector(
    selectRootState,
    (state: RootState) => state.definedContainersByEnv[env.name] || []
  );

export const selectDefinedContainersByEnvAndType = (
  env: Env,
  type: ContainerType
) =>
  createSelector(
    selectRootState,
    (state: RootState) => (state.definedContainersByEnv[env.name] ?? {})[type]
  );

export const selectDefinedContainerByName = (
  name: string
) =>
  createSelector(selectRootState, (state: RootState) => {
    let allContainers: ContainerDefinition[] = [];

    console.log("??? 1");
    console.log(allContainers);
    Object.entries(state.definedContainersByEnv).forEach(
      ([_, containersByType]) => {
        console.log("poop1", containersByType);
        Object.entries(containersByType).forEach(
          ([_, containers]) => {
            console.log("poop2", containersByType);
            allContainers.push(...containers);
            console.log("allContainers:", allContainers)
          }
        )
      }
    )

    console.log("??? 2");
    console.log(allContainers);
    if (isNil(allContainers)) {
      return null;
    }
    for (let container of allContainers) {
      if (container.getHostname() === name) {
        return container;
      }
    }
    return null;
  });
