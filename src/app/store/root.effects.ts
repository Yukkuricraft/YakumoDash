import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { fetchAvailableEnvs, fetchContainerStatusForEnv, initializeApp, setActiveContainersForEnv, setAvailableEnvs, setDefinedContainersForEnv } from "@app/store/root.actions";
import { EnvironmentsService } from "@app/services/environments/environments.service";
import { map, of, switchMap, tap } from "rxjs";
import { Env } from "@app/models/env";
import { DockerService } from "@app/services/docker/docker.service";
import { ContainerDefinition } from "@app/models/container";
import { Store } from "@ngrx/store";

@Injectable()
export class RootEffects {
  constructor(
    private actions$: Actions,
    private dockerApi: DockerService,
    private store: Store,
    private envsApi: EnvironmentsService,
  ) {}

  setAvailableEnvs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initializeApp, fetchAvailableEnvs),
      switchMap(() => this.envsApi.listEnvsWithConfigs()),
      map((envs: Env[]) => setAvailableEnvs({ envs }))
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
