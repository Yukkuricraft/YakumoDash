import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { createNewEnv, NewEnvProps, fetchAvailableEnvs, fetchContainerStatusForEnv, initializeApp, setActiveContainersForEnv, setAvailableEnvs, setDefinedContainersForEnv, setGlobalLoadingBarActive, setGlobalLoadingBarInactive, beginCreateNewEnv, beginDeleteEnv, deleteEnv, beginSpinupEnv, spinupEnv, beginShutdownEnv, shutdownEnv } from "@app/store/root.actions";
import { EnvironmentsService } from "@app/services/environments/environments.service";
import { concatMap, exhaustMap, map, of, startWith, switchMap, tap } from "rxjs";
import { Env } from "@app/models/env";
import { DockerService } from "@app/services/docker/docker.service";
import { ContainerDefinition } from "@app/models/container";
import { Store } from "@ngrx/store";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class RootEffects {
  constructor(
    private actions$: Actions,
    private dockerApi: DockerService,
    private store: Store,
    private envsApi: EnvironmentsService,
    private snackbar: MatSnackBar,
  ) {}

  setAvailableEnvs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initializeApp, fetchAvailableEnvs),
      switchMap(() => this.envsApi.listEnvsWithConfigs()),
      map((envs: Env[]) => setAvailableEnvs({ envs }))
    );
  })

  /** CREATE NEW ENV */
  beginCreateNewEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(beginCreateNewEnv),
      switchMap((data) => {
        return [
          setGlobalLoadingBarActive(),
          createNewEnv(data),
        ]
      })
    )
  })

  createNewEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createNewEnv),
      switchMap((data) => {
        return this.dockerApi.createEnv(data.proxyPort, data.envAlias)
      }),
      switchMap((result) => { 
        console.log("$#$$$$$ CREATED NEW ENV")
        console.log(result);
        const createdEnv = result.createdEnv;
        this.snackbar.open(`Created new env '${createdEnv.env.getFormattedLabel()} running on port '${createdEnv.port}'`)

        return [
          fetchAvailableEnvs(),
          setGlobalLoadingBarInactive(),
        ]
      }),
    );
  })

  /** DELETE ENV */
  beginDeleteEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(beginDeleteEnv),
      switchMap((data) => {
        return [
          setGlobalLoadingBarActive(),
          deleteEnv(data),
        ]
      })
    )
  })

  deleteEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteEnv),
      switchMap((data) => {
        return this.dockerApi.deleteEnv(data.env)
      }),
      switchMap((result) =>  {
        console.log("RESULT FOR DELETE ENV")
        console.log(result);
        this.snackbar.open(`Done deleting env '${result.env.getFormattedLabel()}'`)

        return [
          fetchAvailableEnvs(),
          setGlobalLoadingBarInactive(),
        ]
      }),
    );
  })

  /** START ENV */
  beginSpinupEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(beginSpinupEnv),
      switchMap((data) => {
        return [
          setGlobalLoadingBarActive(),
          spinupEnv(data),
        ]
      })
    )
  })

  spinupEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(spinupEnv),
      switchMap((data) => {
        return this.dockerApi.upEnv(data.env)
      }),
      concatMap((result) =>  {
        this.snackbar.open(`Done starting env '${result.env.getFormattedLabel()}'`)

        return [
          fetchContainerStatusForEnv({ env: result.env }),
          setGlobalLoadingBarInactive(),
        ]
      }),
    );
  })

  /** SHUTDOWN ENV */
  beginShutdownEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(beginShutdownEnv),
      switchMap((data) => {
        return [
          setGlobalLoadingBarActive(),
          shutdownEnv(data),
        ]
      })
    )
  })

  shutdownEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(shutdownEnv),
      switchMap((data) => {
        return this.dockerApi.downEnv(data.env)
      }),
      concatMap((result) =>  {
        this.snackbar.open(`Done shutting down env '${result.env.getFormattedLabel()}'`)

        return [
          fetchContainerStatusForEnv({ env: result.env }),
          setGlobalLoadingBarInactive(),
        ]
      }),
    );
  })
  

  fetchDefinedContainersForEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fetchContainerStatusForEnv),
      switchMap((data) => {
        return this.dockerApi.listDefined(data.env).pipe(
          concatLatestFrom(() => {
            return of(data.env);
          }),
          map(([containers, env]) => setDefinedContainersForEnv({ env, containers }))
        )
      })
    );
  })

  fetchActiveContainersForEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fetchContainerStatusForEnv),
      switchMap((data) => {
        return this.dockerApi.listActive(data.env).pipe(
          concatLatestFrom(() => {
            return of(data.env);
          }),
          map(([containers, env]) => setActiveContainersForEnv({ env, containers }))
        )
      })
    );
  })
}
