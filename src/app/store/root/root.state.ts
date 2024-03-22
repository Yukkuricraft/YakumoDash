import { User } from "@app/models/user";
import {
  EnvToActiveContainerMapping,
  EnvToDefinedContainerMapping,
} from "@app/models/container";
import { Env } from "@app/models/env";
import { EnvToBackupsMapping } from "@app/models/backup";

export interface RootState {
  tabIndex: { [pageName: string]: number };
  user: User | null;
  availableEnvs: Env[];
  activeContainersByEnv: EnvToActiveContainerMapping;
  definedContainersByEnv: EnvToDefinedContainerMapping;
  globalLoadingBarState: boolean;
  backupsByContainerAndEnv: EnvToBackupsMapping;
}

export const initialState: RootState = {
  tabIndex: {},
  user: null,
  availableEnvs: [],
  activeContainersByEnv: {},
  definedContainersByEnv: {},
  globalLoadingBarState: false,
  backupsByContainerAndEnv: {},
};
