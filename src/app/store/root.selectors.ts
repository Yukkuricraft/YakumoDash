import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RootState } from "@app/store/root.state";
import { Features } from "@app/store/index";
import _ from "lodash";

const selectRootState = createFeatureSelector<RootState>(Features.Root)

export const selectUser = createSelector(selectRootState, (state) => state.user);

export const selectAvailableEnvs = createSelector(selectRootState, (state) => state.availableEnvs);
