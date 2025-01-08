import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RootState } from "@app/store/root/root.state";
import { Features } from "@app/store/index";
import { Env } from "@app/models/env";
import { ContainerDefinition } from "@app/models/container";
import { BackupDefinition } from "@app/models/backup";

const selectRootState = createFeatureSelector<RootState>(Features.Root);

export const selectUser = createSelector(
  selectRootState,
  (state: RootState) => state.user
);

export const selectGlobalLoadingBarState = createSelector(
  selectRootState,
  (state: RootState) => state.globalLoadingBarState
);

export const selectAvailableEnvs = createSelector(
  selectRootState,
  (state: RootState) => state.availableEnvs
);

export const selectEnvByEnvString = (envString: string) =>
  createSelector(selectRootState, (state: RootState) => {
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
  createSelector(
    selectRootState,
    (state: RootState) => state.tabIndex[pageType] ?? 0
  );

export const selectBackupsForContainer = (
  containerDef: ContainerDefinition | null
) =>
  createSelector(selectRootState, (state: RootState): BackupDefinition[] => {
    if (containerDef == null) return [];

    const env = containerDef.getContainerEnvString();
    if (env in state.backupsByContainerAndEnv) {
      const containerName = containerDef.getContainerNameShorthand();
      if (containerName in state.backupsByContainerAndEnv[env]) {
        return state.backupsByContainerAndEnv[env][
          containerDef.getContainerNameShorthand()
        ];
      }
    }

    return [];
  });
