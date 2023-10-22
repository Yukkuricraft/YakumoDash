import {
  dateStringTransformer,
  dockerStringArrayTransformer,
} from "@app/helpers/dto-transformers";
import { Transform } from "class-transformer";
import { capitalize, includes } from "lodash";

export enum ContainerType {
  Minecraft = "mc",
  MySQL = "mysql",
  Postgres = "postgres",
  MCProxy = "MCProxy",
  Redis = "Redis",
  Unknown = "unknown",
}

/**
 * Possible "states" corresponding to docker container states.
 */
export enum DockerContainerState {
  Created = "created",
  Restarting = "restarting",
  Running = "running",
  Paused = "paused",
  Exited = "exited",
  Dead = "dead",
  Uninitialized = "uninitialized",
}

export interface ContainerTypeToActiveContainerMapping {
  [containerType: string]: ActiveContainer[];
}

export interface EnvToActiveContainerMapping {
  [env: string]: ContainerTypeToActiveContainerMapping;
}

export interface ContainerTypeToContainerDefinitionMapping {
  [containerType: string]: ContainerDefinition[];
}

export interface EnvToDefinedContainerMapping {
  [env: string]: ContainerTypeToContainerDefinitionMapping;
}

export interface IContainerDefinition {
  image: string;
  labels: string[];
  names: string[];
  mounts: string[];
  networks: string[];
  ports: string[];
}

export class ContainerDefinition implements IContainerDefinition {
  NameLabel = "net.yukkuricraft.container_name";
  TypeLabel = "net.yukkuricraft.container_type";
  EnvLabel = "net.yukkuricraft.env";

  getLabelValue(targetLabel: string) {
    const filteredLabels = this.labels.filter((label: string) =>
      label.includes(targetLabel)
    );
    const label = filteredLabels ? filteredLabels[0] : "";
    const splitLabel = label.split("=");
    return splitLabel.length > 1 ? splitLabel[1] : "";
  }

  /**
   * Returns the label-based container_name.
   *  - labels.net.yukkuricraft.container_name: {thisvalue}
   * This is equivalent to world group names
   * @returns
   */
  getContainerNameLabel() {
    return this.getLabelValue(this.NameLabel);
  }
  /**
   * Returns the docker-context container name, ie what you would use with
   * docker <subcommand> <container_name>
   * Eg,
   * - YC-lobby-prod
   * - yakumo-dash-dev
   * - etc
   * @returns
   */
  getContainerName() {
    return this.names.length > 0 ? this.names[0] : "Undefined";
  }

  getFormattedContainerName() {
    return capitalize(this.getContainerNameLabel());
  }

  labelsToContainerType(labels: string[]) {
    let containerType = ContainerType.Unknown;
    if (includes(labels, `${this.TypeLabel}=minecraft`)) {
      containerType = ContainerType.Minecraft;
    } else if (includes(labels, `${this.TypeLabel}=velocity`)) {
      containerType = ContainerType.MCProxy;
    } else if (includes(labels, `${this.TypeLabel}=mysql`)) {
      containerType = ContainerType.MySQL;
    } else if (includes(labels, `${this.TypeLabel}=redis`)) {
      containerType = ContainerType.Redis;
    } else if (includes(labels, `${this.TypeLabel}=postgres`)) {
      containerType = ContainerType.Postgres;
    }

    return containerType;
  }

  getContainerEnvString(): string {
    return this.getLabelValue(this.EnvLabel);
  }

  getContainerType(): ContainerType {
    return this.labelsToContainerType(this.labels);
  }
  get isMinecraftContainer() {
    return this.getContainerType() === ContainerType.Minecraft;
  }
  get isAuxContainer() {
    return includes(
      [ContainerType.MCProxy, ContainerType.MySQL, ContainerType.Postgres, ContainerType.Redis],
      this.getContainerType()
    );
  }

  getContainerState(): string {
    // If we're running getContainerState() on a ContainerDefinition it means we don't have
    // an analogous ActiveContainer, meaning it's not active, meaning it's down.
    return ContainerStates.Down;
  }

  // ContainerDefinitions come back as proper arrays because Python handles those.
  // This is not true for ActiveContainer which we get directly from `docker ps` output.
  image = "";
  labels: string[] = [];
  names: string[] = [];
  mounts: string[] = [];
  networks: string[] = [];
  ports: string[] = [];
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
  Up = "up",
  Down = "down",
  Transitioning = "transitioning",
  Unknown = "unknown",
}
export interface ActiveContainerStateMapping {
  [state: string]: {
    desc: string;
    condition: (container: ActiveContainer) => boolean;
  };
}
export const StateMapping: ActiveContainerStateMapping = {
  [ContainerStates.Up]: {
    desc: "Container is running.",
    condition: container => {
      return (container ?? {}).state == DockerContainerState.Running;
    },
  },
  [ContainerStates.Down]: {
    desc: "Container is down.",
    condition: container => {
      const downStates = [
        DockerContainerState.Dead,
        DockerContainerState.Exited,
        DockerContainerState.Paused,
      ];
      return includes(downStates, (container ?? {}).state);
    },
  },
  [ContainerStates.Transitioning]: {
    desc: "Container is changing waiting for changes...",
    condition: container => {
      const transitioningStates = [
        DockerContainerState.Uninitialized,
        DockerContainerState.Restarting,
        DockerContainerState.Created,
      ];
      return includes(transitioningStates, (container ?? {}).state);
    },
  },
  [ContainerStates.Unknown]: {
    // Ensure this is always last in the list of states
    desc: "Unknown...",
    condition(container) {
      return true;
    },
  },
};

export class ActiveContainer
  extends ContainerDefinition
  implements IActiveContainer
{
  override getContainerState(): ContainerStates {
    for (let state in StateMapping) {
      if (StateMapping[state].condition(this)) {
        return state as ContainerStates;
      }
    }
    return ContainerStates.Unknown;
  }

  command = "";
  id = "";
  localVolumes = -1;
  runningFor = "";
  size = "";
  state = DockerContainerState.Uninitialized;
  status = "";

  @Transform(dockerStringArrayTransformer)
  override labels: string[] = [];
  @Transform(dockerStringArrayTransformer)
  override names: string[] = [];
  @Transform(dockerStringArrayTransformer)
  override mounts: string[] = [];
  @Transform(dockerStringArrayTransformer)
  override networks: string[] = [];
  @Transform(dockerStringArrayTransformer)
  override ports: string[] = [];

  @Transform(dateStringTransformer)
  createdAt = new Date();
}
