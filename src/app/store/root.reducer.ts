import { initialState, RootState } from "@app/store/root.state";
import { createReducer, on } from "@ngrx/store";
import { setAvailableEnvs, setLoggedInUser, setLogoutUser } from "@app/store/root.actions";

export const rootReducer = createReducer(
  initialState,
  on(setLoggedInUser, (state, { user }): RootState => {
    return ({ ...state, user });
  }),
  on(setLogoutUser, (state): RootState => { return ({ ...state, user: null }) }),
  on(setAvailableEnvs, (state, { envs }): RootState => { return ({ ...state, availableEnvs: envs })}),
);
