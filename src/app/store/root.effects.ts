import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import {
  beginForceNavigateToLogin,
  finishForceNavigateToLogin,
  EnvActions,
  fetchContainerStatusForEnv,
  initializeApp,
  setGlobalLoadingBarActive,
  setGlobalLoadingBarInactive,
  copyConfigsForEnvContainerAndType,
} from "@app/store/root.actions";
import { EnvironmentsService } from "@app/services/environments/environments.service";
import {
  EMPTY,
  concatMap,
  exhaustMap,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from "rxjs";
import { Env } from "@app/models/env";
import { DockerService } from "@app/services/docker/docker.service";
import { ContainerDefinition } from "@app/models/container";
import { Store } from "@ngrx/store";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Injectable()
export class RootEffects {
  constructor(
    private actions$: Actions,
    private dockerApi: DockerService,
    private router: Router,
    private store: Store,
    private envsApi: EnvironmentsService,
    private snackbar: MatSnackBar
  ) {}

  beginForceNavigateToLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(beginForceNavigateToLogin),
      switchMap(() => [
        setGlobalLoadingBarInactive(),
        finishForceNavigateToLogin(),
      ])
    )
  );
  finishForceNavigateToLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(finishForceNavigateToLogin),
        tap(() => this.router.navigateByUrl("/login"))
      ),
    { dispatch: false }
  );

  fetchAvailableEnvs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initializeApp, EnvActions.fetchAvailableEnvs),
      tap(console.log),
      switchMap(() => this.envsApi.listEnvsWithConfigs()),
      map((envs: Env[]) => EnvActions.setAvailableEnvs({ envs }))
    );
  });

  /** CREATE NEW ENV */
  beginCreateNewEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.beginCreateNewEnv),
      switchMap(data => {
        return [
          setGlobalLoadingBarActive(),
          EnvActions.finishCreateNewEnv(data),
        ];
      })
    );
  });

  finishCreateNewEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.finishCreateNewEnv),
      switchMap(data => {
        return this.envsApi.createEnv(
          data.proxyPort,
          data.envAlias,
          data.enableEnvProtection,
          data.serverType,
          data.description
        );
      }),
      switchMap(result => {
        const createdEnv = result.createdEnv;
        this.snackbar.open(
          `Created new env '${createdEnv.env.getFormattedLabel()} running on port '${
            createdEnv.port
          }'`
        );

        return [EnvActions.fetchAvailableEnvs(), setGlobalLoadingBarInactive()];
      })
    );
  });

  /** DELETE ENV */
  beginDeleteEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.beginDeleteEnv),
      switchMap(data => {
        return [setGlobalLoadingBarActive(), EnvActions.finishDeleteEnv(data)];
      })
    );
  });

  deleteEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.finishDeleteEnv),
      switchMap(data => {
        return this.envsApi.deleteEnv(data.env);
      }),
      switchMap(result => {
        console.log("RESULT FOR DELETE ENV");
        console.log(result);
        this.snackbar.open(
          `Done deleting env '${result.env.getFormattedLabel()}'`
        );

        return [EnvActions.fetchAvailableEnvs(), setGlobalLoadingBarInactive()];
      })
    );
  });

  /** START ENV */
  beginSpinupEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.beginSpinupEnv),
      switchMap(data => {
        return [setGlobalLoadingBarActive(), EnvActions.finishSpinupEnv(data)];
      })
    );
  });

  spinupEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.finishSpinupEnv),
      switchMap(data => {
        return this.dockerApi.upEnv(data.env);
      }),
      concatMap(result => {
        this.snackbar.open(
          `Done starting env '${result.env.getFormattedLabel()}'`
        );

        return [
          fetchContainerStatusForEnv({ env: result.env }),
          setGlobalLoadingBarInactive(),
        ];
      })
    );
  });

  /** SHUTDOWN ENV */
  beginShutdownEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.beginShutdownEnv),
      switchMap(data => {
        return [
          setGlobalLoadingBarActive(),
          EnvActions.finishShutdownEnv(data),
        ];
      })
    );
  });

  shutdownEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.finishShutdownEnv),
      switchMap(data => {
        return this.dockerApi.downEnv(data.env);
      }),
      concatMap(result => {
        this.snackbar.open(
          `Done shutting down env '${result.env.getFormattedLabel()}'`
        );

        return [
          fetchContainerStatusForEnv({ env: result.env }),
          setGlobalLoadingBarInactive(),
        ];
      })
    );
  });

  beginShutdownContainer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.beginShutdownContainer),
      switchMap(data => {
        return [
          setGlobalLoadingBarActive(),
          EnvActions.finishShutdownContainer(data),
        ];
      })
    );
  });

  shutdownContainer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.finishShutdownContainer),
      switchMap(data => {
        return this.dockerApi.downContainer(data.containerDef, data.env);
      }),
      concatMap(result => {
        this.snackbar.open(
          `Done shutting down env '${result.env.getFormattedLabel()}'`
        );

        return [
          fetchContainerStatusForEnv({ env: result.env }),
          setGlobalLoadingBarInactive(),
        ];
      })
    );
  });

  fetchDefinedContainersForEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fetchContainerStatusForEnv),
      switchMap(data => {
        return this.dockerApi.listDefined(data.env).pipe(
          concatLatestFrom(() => {
            return of(data.env);
          }),
          map(([containers, env]) =>
            EnvActions.setDefinedContainersForEnv({ env, containers })
          )
        );
      })
    );
  });

  fetchActiveContainersForEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fetchContainerStatusForEnv),
      switchMap(data => {
        return this.dockerApi.listActive(data.env).pipe(
          concatLatestFrom(() => {
            return of(data.env);
          }),
          map(([containers, env]) =>
            EnvActions.setActiveContainersForEnv({ env, containers })
          )
        );
      })
    );
  });

  copyConfigsForEnvContainerAndType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(copyConfigsForEnvContainerAndType),
      switchMap(data => {
        return this.dockerApi.copyConfigs(data.containerDef, data.env, data.configType)
      })
    )
  },
  { dispatch: false }
  );
}
