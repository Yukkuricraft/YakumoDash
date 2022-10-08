import { modelTransformer } from "@app/helpers/dto-transformers";
import { Transform } from "class-transformer";
import { ApiRunnerResponse, IApiRunnerResponse } from "./api";

export interface IEnvConfig {
  proxyPort: number;
  serverType: string;
  serverBuild: string;
  mcVersion: string;
  fsRoot: string;
}

export class EnvConfig {
  proxyPort = 0;
  serverType = "";
  serverBuild = "";
  mcVersion = "";
  fsRoot = "";
}

export interface IEnv {
  type: string;
  num: number | null;
  config: IEnvConfig;

  name: string;
  description: string;
  alias: string;
  formatted: string;
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

  getFormattedLabel() {
    return `${this.formatted} (${this.alias})`;
  }
  getRenderedDescription() {
    return this.description.replace(/\n/g, "<br />");
  }
}

export interface IEnvField {
  env: Env;
}

export class EnvField implements IEnvField {
  @Transform(modelTransformer(Env))
  env = new Env();
}

export interface ICreatedEnv extends IEnvField {
  alias: string;
  port: number;
  description?: string;
}

export class CreatedEnv extends EnvField {
  alias = "";
  port = 0;
  description = "";
}

export interface ICreateEnvResponse {
  createdEnv: ICreatedEnv;
}

export class CreateEnvResponse implements ICreateEnvResponse {
  @Transform(modelTransformer(CreatedEnv))
  createdEnv = new CreatedEnv();
}
