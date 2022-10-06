import { createAction, props } from "@ngrx/store";
import { User } from "@app/models/user";
import { Env } from "@app/models/env";
import { ActiveContainer, ContainerDefinition } from "@app/models/container";
import { MatDialogRef } from "@angular/material/dialog";

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

export const fetchContainerStatusForEnv = createAction(
  '[Root] Fetching Container Status for Env',
  props<{ env: Env }>(),
)

export const setGlobalLoadingBarActive = createAction(
  '[Root] Enabling Global Loading Bar',
)

export const setGlobalLoadingBarInactive = createAction(
  '[Root] Disabling Global Loading Bar',
)

export const setTabIndexForPage = createAction(
  '[Root] Change Tab Index (TODO: Yeah...)',
  props<{ pageType: string, tabIndex: number }>(),
)


/** ENV STUFF  */

export const fetchAvailableEnvs = createAction(
  '[Env] Fetching Available Environments',
)

// Create New Env
export interface NewEnvProps {
  proxyPort: number;
  envAlias: string;
  description?: string;
}
export const beginCreateNewEnv = createAction(
  '[Env] Starting Creation',
  // eslint-disable-next-line ngrx/prefer-inline-action-props
  props<NewEnvProps>(),
)

export const createNewEnv = createAction(
  '[Env] Creating New',
  // eslint-disable-next-line ngrx/prefer-inline-action-props
  props<NewEnvProps>(),
)

// Delete Env
export interface DeleteEnvProps {
  env: Env,
}
export const beginDeleteEnv = createAction(
  '[Env] Starting Delete',
  // eslint-disable-next-line ngrx/prefer-inline-action-props
  props<DeleteEnvProps>(),
)

export const deleteEnv = createAction(
  '[Env] Delete Environment',
  // eslint-disable-next-line ngrx/prefer-inline-action-props
  props<DeleteEnvProps>()
)

// Spinup
export interface SpinupEnvProps {
  env: Env,
}
export const beginSpinupEnv = createAction(
  '[Env] Starting Spinup',
  // eslint-disable-next-line ngrx/prefer-inline-action-props
  props<SpinupEnvProps>(),
)

export const spinupEnv = createAction(
  '[Env] Spinning Up Environment',
  // eslint-disable-next-line ngrx/prefer-inline-action-props
  props<SpinupEnvProps>()
)

// Shutdown
export interface ShutdownEnvProps {
  env: Env,
}
export const beginShutdownEnv = createAction(
  '[Env] Starting Shutdown',
  // eslint-disable-next-line ngrx/prefer-inline-action-props
  props<ShutdownEnvProps>(),
)

export const shutdownEnv = createAction(
  '[Env] Shutting Down Environment',
  // eslint-disable-next-line ngrx/prefer-inline-action-props
  props<ShutdownEnvProps>()
)

// Misc
export const setAvailableEnvs = createAction(
  '[Env] Set Available Environments',
  props<{ envs: Env[] }>()
)

export const setActiveContainersForEnv = createAction(
  '[Env] Set Active Containers for Env',
  props<{ env: Env, containers: ActiveContainer[] }>()
)

export const setDefinedContainersForEnv = createAction(
  '[Env] Set Defined Containers for Env',
  props<{ env: Env, containers: ContainerDefinition[] }>()
)
