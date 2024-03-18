import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from "@ngrx/store";
import { User } from "@app/models/user";
import { Env } from "@app/models/env";
import { ActiveContainer, DataFileType, ContainerDefinition, ContainerType } from "@app/models/container";
import { BackupDefinition } from "@app/models/backup";

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

export interface EnvsProp {
  envs: Env[];
}

export interface ContainerProp {
  containerDef: ContainerDefinition
};

export interface ContainerAndBackupProps {
  containerDef: ContainerDefinition;
  backups: BackupDefinition[];
}

export interface EnvAndActiveContainersProps {
  env: Env;
  containers: ActiveContainer[];
}

export interface EnvAndContainerDefinitionsProps {
  env: Env;
  containers: ContainerDefinition[];
}

export interface PageTypeAndTabIndexProps {
  pageType: string;
  tabIndex: number
}

export interface ContainerAndDataFileTypeProp {
  containerDef: ContainerDefinition,
  dataFileType: DataFileType,
}


export const RootActions = createActionGroup({
  source: "Root",
  events: {
    "Begin force navigate to login": emptyProps(),
    "Finish force navigate to login": emptyProps(),
    "Initialize app": emptyProps(),
    "Set logged in user": props<UserProp>(),
    "Set logout user": emptyProps(),
    "Fetch container status for env": props<EnvProp>(),
    "Copy configs for container and type": props<ContainerAndDataFileTypeProp>(),
    "Set global loading bar active": emptyProps(),
    "Set global loading bar inactive": emptyProps(),
    "Set tab index for page": props<PageTypeAndTabIndexProps>(),
  }
});


export const SocketActions = createActionGroup({
  source: "Environment",
  events: {
    "Connect To Websocket": props<{
      endpoint: string
    }>(),
    "Disconnect To Websocket": props<{
      endpoint: string
    }>(),
    "Send Message": props<{
      endpoint: string;
      data: any
    }>(),
  },
});


export const EnvActions = createActionGroup({
  source: "Environment",
  events: {
    "Fetch Available Envs": emptyProps(),
    "Set Available Envs": props<EnvsProp>(),
    "Set Active Containers For Env": props<EnvAndActiveContainersProps>(),
    "Set Defined Containers For Env": props<EnvAndContainerDefinitionsProps>(),

    "Begin Create New Env": props<CreateEnvProps>(),
    "Finish Create New Env": props<CreateEnvProps>(),

    "Begin Delete Env": props<EnvProp>(),
    "Finish Delete Env": props<EnvProp>(),

    "Begin Spinup Env": props<EnvProp>(),
    "Finish Spinup Env": props<EnvProp>(),

    "Begin Spinup Container": props<ContainerProp>(),
    "Finish Spinup Container": props<ContainerProp>(),

    "Begin Shutdown Env": props<EnvProp>(),
    "Finish Shutdown Env": props<EnvProp>(),

    "Begin Shutdown Container": props<ContainerProp>(),
    "Finish Shutdown Container": props<ContainerProp>(),
  },
});


export const BackupActions = createActionGroup({
  source: "Backups",
  events: {
    "Fetch Backups For Container": props<ContainerProp>(),
    "Set Backups For Container": props<ContainerAndBackupProps>(),
    "Create new backup": props<ContainerProp>(),
  }
});