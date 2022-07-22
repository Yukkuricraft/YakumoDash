import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RootState } from "@app/store/root.state";
import { Features } from "@app/store/index";
import _ from "lodash";

const selectRootState = createFeatureSelector<RootState>(Features.Root)

export const selectUser = createSelector(selectRootState, (state) => state.user);

export const selectAvailableEnvs = createSelector(selectRootState, (state) => state.availableEnvs);
export const selectAvailableEnvsFormatted = createSelector(selectRootState, (state) => {
  const unsortedEnvs = state.availableEnvs;
  let sortedEnvs = [];
  if (_.includes(unsortedEnvs, 'prod')) {
    sortedEnvs.push('prod')
  }

  for(const envName of state.availableEnvs) {
    if (envName !== 'prod') {
      sortedEnvs.push(envName)
    }
  }

  console.log(state.availableEnvs, sortedEnvs)

  return sortedEnvs.map((env) => {
    const envName = env.replace(/\d/g, "");
    const envNum = env.replace(/\D/g, "")
    return _.capitalize(envName) + ` ${envNum}`;
  });
});
