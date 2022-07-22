import { User } from "@app/models/user";

export interface RootState {

  user: User | null;
  availableEnvs: string[];
}

export const initialState: RootState = {
  user: null,
  availableEnvs: [],
}
