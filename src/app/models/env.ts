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

export class Env implements IEnv{
  type = "";
  num: number | null = null;
  port = 0;

  @Transform(modelTransformer(EnvConfig))
  config = new EnvConfig();

  name = "";
  description = "";
  alias = "";
  formatted = "";

  getFormattedLabel() { return `${this.formatted} (${this.alias})`; }
  getRenderedDescription() { return this.description.replace(/\n/g, "<br />");}
}

export interface ICreatedEnv {
  env: Env;
  alias: string;
  port: number;
  description?: string;
}

export class CreatedEnv {
  env = new Env();
  alias = "";
  port = 0;
  description = "";
}

export interface ICreateEnvResponse extends IApiRunnerResponse {
  createdEnv: ICreatedEnv;
}

export class CreateEnvResponse extends ApiRunnerResponse implements ICreateEnvResponse {
  @Transform(modelTransformer(CreatedEnv))
  createdEnv = new CreatedEnv();
}