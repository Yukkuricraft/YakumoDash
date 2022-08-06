import { User } from "@app/models/user";
import {
  Container,
  ContainerType,
  EnvContainerMapping
} from "@app/models/container";
import { Env } from "@app/models/env";

export interface RootState {
  tabIndex: { [pageName: string]: number };
  user: User | null;
  availableEnvs: Env[];
  containersByEnv: EnvContainerMapping;
}

export const initialState: RootState = {
  tabIndex: {},
  user: null,
  availableEnvs: [],
  containersByEnv: {},
}
