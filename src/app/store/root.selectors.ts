import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RootState } from "@app/store/root.state";
import { Features } from "@app/store/index";
import { Env } from "@app/models/env";
import { ContainerType } from "@app/models/container";

const selectRootState =
  createFeatureSelector<RootState>(Features.Root)

export const selectUser =
  createSelector(selectRootState, (state) => state.user);

export const selectAvailableEnvs =
  createSelector(selectRootState, (state) => state.availableEnvs);

export const selectActiveContainersByEnv = (env: Env) =>
  createSelector(selectRootState, (state) => state.activeContainersByEnv[env.name] || [])

export const selectActiveContainersByEnvAndType = (env: Env, type: ContainerType) =>
  createSelector(selectRootState, (state) => (state.activeContainersByEnv[env.name] ?? {})[type])

export const selectDefinedContainersByEnv = (env: Env) =>
  createSelector(selectRootState, (state) => state.definedContainersByEnv[env.name] || [])

export const selectDefinedContainersByEnvAndType = (env: Env, type: ContainerType) =>
  createSelector(selectRootState, (state) => (state.definedContainersByEnv[env.name] ?? {})[type])

export const selectCurrentTabIndex = (pageType: string) =>
  createSelector(selectRootState, (state) => state.tabIndex[pageType] ?? 0)
