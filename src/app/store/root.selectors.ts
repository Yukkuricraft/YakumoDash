import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RootState } from "@app/store/root.state";
import { Features } from "@app/store/index";
import { Env } from "@app/models/env";

const selectRootState = createFeatureSelector<RootState>(Features.Root);

export const selectUser = createSelector(selectRootState, state => state.user);

export const selectGlobalLoadingBarState = createSelector(
  selectRootState,
  state => state.globalLoadingBarState
);

export const selectAvailableEnvs = createSelector(
  selectRootState,
  state => state.availableEnvs
);

export const selectEnvByEnvString = (envString: string) =>
  createSelector(selectRootState, state => {
    for (const env of state.availableEnvs) {
      if (env.name === envString) {
        return env;
      }
    }
    throw Error(
      `Got an env string that doesn't match any known Envs! Got: ${envString}`
    );
  });

export const selectCurrentTabIndex = (pageType: string) =>
  createSelector(selectRootState, state => state.tabIndex[pageType] ?? 0);
