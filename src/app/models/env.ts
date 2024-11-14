import { modelTransformer } from "@app/helpers/dto-transformers";
import { Transform } from "class-transformer";
import { ApiRunnerResponse, IApiRunnerResponse } from "./api";

export interface IGeneralConfig {
  description: string;
  hostname: string;
}
export class GeneralConfig implements IGeneralConfig{
  description = "";
  hostname = "";
}

export interface IWorldGroups {
  enabledGroups: string[];
}
export class WorldGroups {
  enabledGroups = [];
}

type IClusterVariables = Record<string, any>;

export class ClusterVariables implements IClusterVariables {
  envAlias = "";
  mcFsRoot = "";
  mcType = "";
  mcVersion = "";
  velocityPort = "";
  ycRepoRoot = "";
  backupsRoot = "";
  // ...And whatever else may be added
}

export interface IEnvConfig {
  general: IGeneralConfig;
  worldGroups: IWorldGroups;
  clusterVariables: IClusterVariables;
}

export class EnvConfig implements IEnvConfig {
  general = new GeneralConfig();
  worldGroups = new WorldGroups();
  clusterVariables: IClusterVariables = new ClusterVariables();
}

export interface IEnv {
  type: string;
  num: number | null;
  config: IEnvConfig;

  name: string;
  description: string;
  alias: string;
  formatted: string;

  enableEnvProtection: boolean;
}

export class Env implements IEnv {
  type = "";
  num: number | null = null;
  port = 0;

  @Transform(modelTransformer(EnvConfig))
  config = new EnvConfig();

  name = "";
  description = "";
  alias = "";
  formatted = "";

  enableEnvProtection = false;

  getFormattedLabel() {
    return this.formatted;
  }
  getRenderedDescription() {
    return this.description.replace(/\n/g, "<br />");
  }
}

export interface ICreateEnvResponse {
  createdEnv: IEnv;
}

export class CreateEnvResponse implements ICreateEnvResponse {
  @Transform(modelTransformer(Env))
  createdEnv = new Env();
}
