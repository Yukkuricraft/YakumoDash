import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from "@ngrx/store";
import { User } from "@app/models/user";
import { Env } from "@app/models/env";
import { ActiveContainer, ConfigType, ContainerDefinition, ContainerType } from "@app/models/container";
import { MatDialogRef } from "@angular/material/dialog";

export const beginForceNavigateToLogin = createAction(
  "[Root] Begin force navigation to login page"
);

export const finishForceNavigateToLogin = createAction(
  "[Root] Finish force navigation to login page"
);

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

export const copyConfigsForEnvContainerAndType = createAction(
  '[Root] Copying Configs for Env, Container, and Type',
  props<{ env: Env, containerDef: ContainerDefinition, configType: ConfigType}>()
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
  enableEnvProtection: boolean;
  serverType: string;
  description?: string;
}

export const SocketActions = createActionGroup({
  source: "Environment",
  events: {
    "Connect To Websocket": props<{ endpoint: string }>(),
    "Disconnect To Websocket": props<{ endpoint: string }>(),
    "Send Message": props<{ endpoint: string; data: any }>(),
  },
});

export interface DeleteEnvProps {
  env: Env;
}

export interface SpinupEnvProps {
  env: Env;
}

export interface SpinupContainerProps {
  env: Env;
  containerDef: ContainerDefinition;
}

export interface ShutdownEnvProps {
  env: Env;
}

export interface ShutdownContainerProps {
  env: Env;
  containerDef: ContainerDefinition;
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

    "Begin Spinup Container": props<SpinupContainerProps>(),
    "Finish Spinup Container": props<SpinupContainerProps>(),

    "Begin Shutdown Env": props<ShutdownEnvProps>(),
    "Finish Shutdown Env": props<ShutdownEnvProps>(),

    "Begin Shutdown Container": props<ShutdownContainerProps>(),
    "Finish Shutdown Container": props<ShutdownContainerProps>(),
  },
});
