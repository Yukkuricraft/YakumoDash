import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { initializeApp, setAvailableEnvs } from "@app/store/root.actions";
import { EnvironmentsService } from "@app/services/environments/environments.service";
import { map, switchMap, tap } from "rxjs";

@Injectable()
export class RootEffects {
  constructor(
    private actions$: Actions,
    private envsApi: EnvironmentsService,
  ) {}

  setAvailableEnvs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initializeApp),
      switchMap(() => this.envsApi.listEnvsWithConfigs()),
      map((envs: string[]) => setAvailableEnvs({ envs }))
    );
  })
}
