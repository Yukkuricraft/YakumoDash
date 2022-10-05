import { createdEnvTransformer } from "@app/helpers/dto-transformers";
import { Transform } from "class-transformer";
import { ApiRunnerResponse, IApiRunnerResponse } from "./api";

export interface IEnv {
  name: string;
  alias: string;

  type: string;
  num: number | null;

  formatted: string;
}

export class Env implements IEnv{
  public static createEnvFromObject({ name, alias, type, num, formatted }: IEnv) {
    let env = new Env();
    env.name = name;
    env.alias = alias;
    env.type = type;
    env.num = num;
    env.formatted = formatted;
    return env;
  }

  name = "";
  alias = "";

  type = "";
  num: number | null = null;

  formatted = "";

  getFormattedLabel() { return `${this.formatted} (${this.alias})`; }
}

export interface ICreatedEnv {
  env: Env;
  alias: string;
  port: number;
}

export class CreatedEnv {
  public static createCreatedEnvFromObject({ env, alias, port }: ICreatedEnv) {
    let createdEnv = new CreatedEnv();
    createdEnv.env = Env.createEnvFromObject(env);
    createdEnv.alias = alias;
    createdEnv.port = port;
    return createdEnv;
  }

  env = new Env();
  alias = "";
  port = 0;
}

export interface ICreateEnvResponse extends IApiRunnerResponse {
  createdEnv: ICreatedEnv;
}

export class CreateEnvResponse extends ApiRunnerResponse implements ICreateEnvResponse {
  @Transform(createdEnvTransformer)
  createdEnv = new CreatedEnv();
}