import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from "@ngrx/store";
import { User } from "@app/models/user";
import { Env } from "@app/models/env";
import { ActiveContainer, ContainerDefinition } from "@app/models/container";
import { MatDialogRef } from "@angular/material/dialog";

export const initializeApp = createAction("[Root] Initializing YakumoDash");

export const setLoggedInUser = createAction(
  "[Root] Set Logged-In User",
  props<{ user: User }>()
);

export const setLogoutUser = createAction("[Root] Set Logout User");

export const fetchContainerStatusForEnv = createAction(
  "[Root] Fetching Container Status for Env",
  props<{ env: Env }>()
);

export const setGlobalLoadingBarActive = createAction(
  "[Root] Enabling Global Loading Bar"
);

export const setGlobalLoadingBarInactive = createAction(
  "[Root] Disabling Global Loading Bar"
);

export const setTabIndexForPage = createAction(
  "[Root] Change Tab Index (TODO: Yeah...)",
  props<{ pageType: string; tabIndex: number }>()
);

export interface CreateEnvProps {
  proxyPort: number;
  envAlias: string;
  description?: string;
}

export interface DeleteEnvProps {
  env: Env;
}

export interface SpinupEnvProps {
  env: Env;
}

export interface ShutdownEnvProps {
  env: Env;
}

export const EnvActions = createActionGroup({
  source: "Environment",
  events: {
    "Fetch Available Envs": emptyProps(),
    "Set Available Envs": props<{ envs: Env[] }>(),
    "Set Active Containers For Env": props<{
      env: Env;
      containers: ActiveContainer[];
    }>(),
    "Set Defined Containers For Env": props<{
      env: Env;
      containers: ContainerDefinition[];
    }>(),

    "Begin Create New Env": props<CreateEnvProps>(),
    "Finish Create New Env": props<CreateEnvProps>(),

    "Begin Delete Env": props<DeleteEnvProps>(),
    "Finish Delete Env": props<DeleteEnvProps>(),

    "Begin Spinup Env": props<SpinupEnvProps>(),
    "Finish Spinup Env": props<SpinupEnvProps>(),

    "Begin Shutdown Env": props<ShutdownEnvProps>(),
    "Finish Shutdown Env": props<ShutdownEnvProps>(),
  },
});
