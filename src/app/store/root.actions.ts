import { createAction, props } from "@ngrx/store";
import { User } from "@app/models/user";
import { Env } from "@app/models/env";
import { Container } from "@app/models/container";

export const initializeApp = createAction(
  '[Root] Initializing YakumoDash',
)

export const setLoggedInUser = createAction(
  '[Root] Set Logged-In User',
  props<{ user: User }>()
)

export const setLogoutUser = createAction(
  '[Root] Set Logout User',
)

export const setAvailableEnvs = createAction(
  '[Root] Set Available Environments',
  props<{ envs: Env[] }>()
)

export const setContainersForEnv = createAction(
  '[Root] Set Containers for Env',
  props<{ env: Env, containers: Container[] }>()
)

export const setTabIndexForPage = createAction(
  '[Root] Change Tab Index (TODO: Yeah...)',
  props<{ pageType: string, tabIndex: number }>(),
)
