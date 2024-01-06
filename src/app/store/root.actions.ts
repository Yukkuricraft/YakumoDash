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

export interface CreateEnvProps {
  proxyPort: number;
  envAlias: string;
  enableEnvProtection: boolean;
  serverType: string;
  description?: string;
};

export interface UserProp {
  user: User;
}

export interface EnvProp {
  env: Env;
};

export interface EnvAndContainerProps {
  env: Env;
  containerDef: ContainerDefinition;
};

export const RootActions = createActionGroup({
  source: "Root",
  events: {
    "Begin force navigate to login": emptyProps(),
    "Finish force navigate to login": emptyProps(),
    "Initialize app": emptyProps(),
    "Set logged in user": props<UserProp>(),
    "Set logout user": emptyProps(),
    "Fetch container status for env": props<EnvProp>(),
    "Copy configs for env container and type": props<{
      env: Env,
      containerDef: ContainerDefinition,
      configType: ConfigType
    }>(),
    "Set global loading bar active": emptyProps(),
    "Set global loading bar inactive": emptyProps(),
    "Set tab index for page": props<{ pageType: string; tabIndex: number }>(),
  }
});


export const SocketActions = createActionGroup({
  source: "Environment",
  events: {
    "Connect To Websocket": props<{ endpoint: string }>(),
    "Disconnect To Websocket": props<{ endpoint: string }>(),
    "Send Message": props<{ endpoint: string; data: any }>(),
  },
});


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

    "Begin Delete Env": props<EnvProp>(),
    "Finish Delete Env": props<EnvProp>(),

    "Begin Spinup Env": props<EnvProp>(),
    "Finish Spinup Env": props<EnvProp>(),

    "Begin Spinup Container": props<EnvAndContainerProps>(),
    "Finish Spinup Container": props<EnvAndContainerProps>(),

    "Begin Shutdown Env": props<EnvProp>(),
    "Finish Shutdown Env": props<EnvProp>(),

    "Begin Shutdown Container": props<EnvAndContainerProps>(),
    "Finish Shutdown Container": props<EnvAndContainerProps>(),
  },
});


export const BackupActions = createActionGroup({
  source: "Backups",
  events: {
    "List Backups": props<EnvAndContainerProps>(),
  }
});