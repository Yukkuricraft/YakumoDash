import { createAction, props } from "@ngrx/store";
import { SocialUser } from "@abacritt/angularx-social-login";

export const setLoggedInUser = createAction(
  '[Root] Set Logged-In User',
  props<{ user: SocialUser }>()
)

export const setLogoutUser = createAction(
  '[Root] Set Logout User',
)
