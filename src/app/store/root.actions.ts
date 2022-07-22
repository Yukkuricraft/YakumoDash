import { createAction, props } from "@ngrx/store";
import { User } from "@app/models/user";
import { Env } from "@app/models/server";

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
