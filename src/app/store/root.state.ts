import { User } from "@app/models/user";
import {
  EnvToActiveContainerMapping,
  EnvToDefinedContainerMapping,
} from "@app/models/container";
import { Env } from "@app/models/env";

export interface RootState {
  tabIndex: { [pageName: string]: number };
  user: User | null;
  availableEnvs: Env[];
  activeContainersByEnv: EnvToActiveContainerMapping;
  definedContainersByEnv: EnvToDefinedContainerMapping;
  globalLoadingBarState: boolean;
}

export const initialState: RootState = {
  tabIndex: {},
  user: null,
  availableEnvs: [],
  activeContainersByEnv: {},
  definedContainersByEnv: {},
  globalLoadingBarState: false,
};
