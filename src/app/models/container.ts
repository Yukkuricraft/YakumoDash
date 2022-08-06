import {
  dateStringTransformer,
  dockerStringArrayTransformer
} from "@app/helpers/dto-transformers";
import { Transform } from "class-transformer";

export enum ContainerType {
  Minecraft = 'mc',
  MySQL = 'mysql',
  Velocity = 'vel',
  Unknown = 'unknown',
}

export enum ContainerState {
  Created,
  Restarting,
  Running,
  Paused,
  Exited,
  Dead,
  Uninitialized,
}

export interface ContainerTypeToContainerMapping {
  [containerType: string]: Container[],
}

export interface EnvContainerMapping {
  [env: string]: ContainerTypeToContainerMapping
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
