import {
  dateStringTransformer,
  dockerStringArrayTransformer
} from "@app/helpers/dto-transformers";
import { Transform } from "class-transformer";
import _ from "lodash";

export enum ContainerType {
  Minecraft = 'mc',
  MySQL = 'mysql',
  MCProxy = 'MCProxy',
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

const ServiceLabel = "net.yukkuricraft.container_name";
export class Container implements IContainer {
  get containerName() {
    const serviceLabel: string = this.labels.filter((label: string) => label.includes(ServiceLabel))[0];
    return _.capitalize(serviceLabel ? serviceLabel.split("=")[1] : this.names[0]);
  }

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
