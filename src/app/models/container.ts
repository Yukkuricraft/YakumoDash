import {
  dateStringTransformer,
  dockerStringArrayTransformer,
} from "@app/helpers/dto-transformers";
import { Transform, Exclude } from "class-transformer";
import { capitalize, includes } from "lodash";
import { Env } from "./env";

export enum ContainerType {
  Minecraft = "minecraft",
  Backup = "backup",
  MySQL = "mysql",
  Postgres = "postgres",
  MCProxy = "velocity",
  Redis = "redis",
  Unknown = "unknown",
}

function isValidContainerType(value: string): value is ContainerType {
  return Object.values<string>(ContainerType).includes(value);
}

export enum DataDirType {
  PluginConfigs = "plugin_configs",
  ModConfigs = "mod_configs",
  ServerConfigs = "server_configs",

  // While these are part of the DataFileType enum on serverside we should never
  // be interacting with the following three from frontend side.
  // Smelly.
  LogFiles = "log_files",
  WorldFiles = "world_files",
  PluginFiles = "plugin_files",
  ModFiles = "mod_files",
  ClientAndServerModFiles = "client_and_server_mod_files",
  ServerOnlyModFiles = "server_only_mod_files",
  CrashReports = "crash_reports",
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
  env: Env;
  image: string;
  labels: Record<string,string>;
  names: string[];
  containerName: string;
  hostname: string;
  mounts: string[];
  networks: string[];
  ports: string[];
}

export class ContainerDefinition implements IContainerDefinition {
  NameLabel = "net.yukkuricraft.container_name";
  TypeLabel = "net.yukkuricraft.container_type";
  EnvLabel = "net.yukkuricraft.env";

  getLabelValue(targetLabel: string) {
    if (targetLabel in this.labels) {
      return this.labels[targetLabel];
    } else {
      return null;
    }
  }

  /**
   * Returns the label-based container_name.
   *  - labels.net.yukkuricraft.container_name: {thisvalue}
   * This is equivalent to world group names
   * @returns
   */
  getContainerNameLabel(): string{
    return this.getLabelValue(this.NameLabel) ?? "UnknownContainer";
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
  getHostname() {
    return this.hostname;
  }

  getContainerNameShorthand() {
    return this.names.length > 0 ? this.names[0] : this.hostname;
  }

  getFormattedContainerName() {
    return capitalize(this.getContainerNameLabel());
  }

  getContainerEnvString(): string {
    return this.getLabelValue(this.EnvLabel) ?? "UnknownEnv";
  }

  getContainerType(): ContainerType {
    const label = this.getLabelValue(this.TypeLabel) ?? "unknown";
    if (isValidContainerType(label)) {
      return label as ContainerType;
    } else {
      return ContainerType.Unknown
    }
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
  env = new Env();
  image = "";
  containerName = "";
  hostname = "";
  labels: Record<string,string> = {};
  names: string[] = [];
  mounts: string[] = [];
  networks: string[] = [];
  ports: string[] = [];
}

export interface IActiveContainer extends IContainerDefinition {
  command: string;
  createdAt: Date;
  id: string;
  runningFor: string;
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
  runningFor = "";
  state = DockerContainerState.Uninitialized;
  status = "";

  override labels: Record<string, string> = {};
  override names: string[] = [];
  override mounts: string[] = [];
  override networks: string[] = [];
  override ports: string[] = [];

  @Transform(dateStringTransformer)
  createdAt = new Date();
}
