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

export const selectCurrentTabIndex = (pageType: string) =>
  createSelector(selectRootState, state => state.tabIndex[pageType] ?? 0);
