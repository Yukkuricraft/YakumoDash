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

/**
 * Possible "states" corresponding to docker container states.
 */
export enum DockerContainerState {
  Created = 'created',
  Restarting = 'restarting',
  Running = 'running',
  Paused = 'paused',
  Exited = 'exited',
  Dead = 'dead',
  Uninitialized = 'uninitialized',
}

export interface ContainerTypeToActiveContainerMapping {
  [containerType: string]: ActiveContainer[],
}

export interface EnvToActiveContainerMapping {
  [env: string]: ContainerTypeToActiveContainerMapping
}

export interface ContainerTypeToContainerDefinitionMapping {
  [containerType: string]: ContainerDefinition[],
}

export interface EnvToDefinedContainerMapping {
  [env: string]: ContainerTypeToContainerDefinitionMapping
}

export interface IContainerDefinition {
  image: string;
  labels: string[];
  names: string[];
  mounts: string[];
  networks: string[];
  ports: string[];
}

export class ContainerDefinition {
  ServiceLabel = "net.yukkuricraft.container_name";
  TypeLabel = "net.yukkuricraft.container_type";

  get containerName() {
    const serviceLabel: string = this.labels.filter((label: string) => label.includes(this.ServiceLabel))[0];
    return _.capitalize(serviceLabel ? serviceLabel.split("=")[1] : this.names[0]);
  }

  labelsToContainerType(labels: string[]) {
    let containerType = ContainerType.Unknown;
    if (_.includes(labels, `${this.TypeLabel}=minecraft`)) {
      containerType = ContainerType.Minecraft;
    } else if (_.includes(labels, `${this.TypeLabel}=velocity`)) {
      containerType = ContainerType.MCProxy;
    } else if (_.includes(labels, `${this.TypeLabel}=mysql`)) {
      containerType = ContainerType.MySQL;
    }

    return containerType;
  }

  getContainerState(): string {
  // If we're running getContainerState() on a ContainerDefinition it means we don't have
    // an analogous ActiveContainer, meaning it's not active, meaning it's down.
    return ContainerStates.Down;
  }

  // ContainerDefinitions come back as proper arrays becausse Python handles those.
  // This is not true for ActiveContainer which we get directly from `docker ps` output.
  image = '';
  labels = [];
  names = [];
  mounts = [];
  networks = [];
  ports = [];
}

export interface IActiveContainer extends IContainerDefinition {
  command: string;
  createdAt: Date;
  id: string;
  localVolumes: number;
  runningFor: string;
  size: string;
  state: DockerContainerState;
  status: string;
}

/**
 * Our own interpretation of "states", which are
 * essentially a "summary" of docker states.
 */
export enum ContainerStates {
  Up = 'up',
  Down = 'down',
  Transitioning ='transitioning',
  Unknown = 'unknown',
}
export interface ActiveContainerStateMapping {
  [state: string]: {
    desc: string,
    condition: (container: ActiveContainer) => boolean
  },
}
export const StateMapping: ActiveContainerStateMapping = {
  [ContainerStates.Up]: {
    desc: 'Container is running.',
    condition: (container) => {
      return (container ?? {}).state == DockerContainerState.Running ;
    }
  },
  [ContainerStates.Down]: {
    desc: 'Container is down.',
    condition: (container) => {
      const downStates = [
        DockerContainerState.Dead,
        DockerContainerState.Exited,
        DockerContainerState.Paused,
      ]
      return _.includes(downStates, (container ?? {}).state);
    }
  },
  [ContainerStates.Transitioning]: {
    desc: 'Container is changing waiting for changes...',
    condition: (container) => {
      const transitioningStates = [
        DockerContainerState.Uninitialized,
        DockerContainerState.Restarting,
        DockerContainerState.Created,
      ]
      return _.includes(transitioningStates, (container ?? {}).state);
    }
  },
  [ContainerStates.Unknown]: {
    // Ensure this is always last in the list of states
    desc: 'Unknown...',
    condition (container) {
      return true;
    },
  }
}


export class ActiveContainer extends ContainerDefinition implements IActiveContainer {
  override getContainerState(): string {
    for (let state in StateMapping) {
      if (StateMapping[state].condition(this)) {
        return state;
      }
    }
    return ContainerStates.Unknown;
  }

  command = '';
  id = '';
  localVolumes = -1;
  runningFor = '';
  size = '';
  state = DockerContainerState.Uninitialized;
  status = '';

  @Transform(dockerStringArrayTransformer)
  override labels = [];
  @Transform(dockerStringArrayTransformer)
  override names = [];
  @Transform(dockerStringArrayTransformer)
  override mounts = [];
  @Transform(dockerStringArrayTransformer)
  override networks = [];
  @Transform(dockerStringArrayTransformer)
  override ports = [];

  @Transform(dateStringTransformer)
  createdAt = new Date();
}
