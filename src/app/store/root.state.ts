import { User } from "@app/models/user";
import { Env } from "@app/models/server";

export interface RootState {

  user: User | null;
  availableEnvs: Env[];
}

export const initialState: RootState = {
  user: null,
  availableEnvs: [],
}
