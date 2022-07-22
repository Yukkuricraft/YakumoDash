import {
  dateStringTransformer,
  dockerStringArrayTransformer
} from "@app/helpers/dto-transformers";
import { Transform } from "class-transformer";

export interface IEnv {
  name: string;
  alias: string;

  type: string;
  num: number | null;

  formatted: string;
}

export enum ContainerState {
  Created,
  Restarting,
  Running,
  Paused,
  Exited,
  Dead,
  Uninitialized
}

export interface IContainer {
  command: string;
  createdAt: Date;
  id: string;
  image: string;
  localVolumes: number;
  labels: string[];
  mounts: string[];
  names: string[];
  networks: string[];
  ports: string[];
  runningFor: string;
  size: string;
  state: ContainerState;
  status: string;
}

export class Env implements IEnv{
  name = "";
  alias = "";

  type = "";
  num: number | null = null;

  formatted = "";
}

export class Container implements IContainer {
  command = '';

  @Transform(dateStringTransformer)
  createdAt = new Date();
  id = '';
  image = '';
  localVolumes = -1;

  @Transform(dockerStringArrayTransformer)
  labels = [];

  @Transform(dockerStringArrayTransformer)
  mounts = [];

  @Transform(dockerStringArrayTransformer)
  names = [];

  @Transform(dockerStringArrayTransformer)
  networks = [];

  @Transform(dockerStringArrayTransformer)
  ports = []

  runningFor = '';
  size = '';
  state = ContainerState.Uninitialized;
  status = '';
}
