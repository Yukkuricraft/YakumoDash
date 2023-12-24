import { modelTransformer } from "@app/helpers/dto-transformers";
import { Transform } from "class-transformer";
import { ApiRunnerResponse, IApiRunnerResponse } from "./api";
import { Env } from "./env";

export interface IDockerEnvActionResponse extends IApiRunnerResponse {
  env: Env;
}

export class DockerEnvActionResponse
  extends ApiRunnerResponse
  implements IDockerEnvActionResponse
{
  @Transform(modelTransformer(Env))
  env = new Env();
}

export interface IDockerContainerActionResponse extends IApiRunnerResponse {
  env: Env;
  containerName: string;
}

export class DockerContainerActionResponse
  extends ApiRunnerResponse
  implements IDockerEnvActionResponse
{
  @Transform(modelTransformer(Env))
  env = new Env();

  containerName = "";
}
