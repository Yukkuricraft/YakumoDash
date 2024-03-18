import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import {
  RootActions,
  EnvActions,
  BackupActions,
  CreateEnvProps,
  EnvProp,
  ContainerProp,
  ContainerAndDataFileTypeProp,
} from "@app/store/root.actions";
import { EnvironmentsService } from "@app/services/environments/environments.service";
import {
  Observable,
  EMPTY,
  concatMap,
  exhaustMap,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from "rxjs";
import { CreateEnvResponse, Env } from "@app/models/env";
import { DockerService } from "@app/services/docker/docker.service";
import { Store } from "@ngrx/store";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { BackupsService } from "@app/services/backups/backups.service";
import { ActiveContainer, ContainerDefinition } from "@app/models/container";
import { BackupDefinition } from "@app/models/backup";
import { DockerContainerActionResponse } from "@app/models/docker";

@Injectable()
export class RootEffects {
  constructor(
    private actions$: Actions,
    private dockerApi: DockerService,
    private router: Router,
    private store: Store,
    private envsApi: EnvironmentsService,
    private backupsApi: BackupsService,
    private snackbar: MatSnackBar
  ) {}

  beginForceNavigateToLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RootActions.beginForceNavigateToLogin),
      switchMap(() => [
        RootActions.setGlobalLoadingBarInactive(),
        RootActions.finishForceNavigateToLogin(),
      ])
    )
  );
  finishForceNavigateToLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RootActions.finishForceNavigateToLogin),
        tap(() => this.router.navigateByUrl("/login"))
      ),
    { dispatch: false }
  );

  fetchAvailableEnvs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RootActions.initializeApp, EnvActions.fetchAvailableEnvs),
      tap(console.log),
      switchMap(() => this.envsApi.listEnvsWithConfigs()),
      map((envs: Env[]) => EnvActions.setAvailableEnvs({ envs }))
    );
  });

  /** CREATE NEW ENV */
  beginCreateNewEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.beginCreateNewEnv),
      switchMap((data: CreateEnvProps) => {
        return [
          RootActions.setGlobalLoadingBarActive(),
          EnvActions.finishCreateNewEnv(data),
        ];
      })
    );
  });

  finishCreateNewEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.finishCreateNewEnv),
      switchMap(({ proxyPort, envAlias, enableEnvProtection, serverType, description }: CreateEnvProps) => {
        return this.envsApi.createEnv(
          proxyPort,
          envAlias,
          enableEnvProtection,
          serverType,
          description
        );
      }),
      switchMap(({ createdEnv }: CreateEnvResponse ) => {
        this.snackbar.open(
          `Created new env '${createdEnv.env.getFormattedLabel()} running on port '${
            createdEnv.port
          }'`
        );

        return [EnvActions.fetchAvailableEnvs(), RootActions.setGlobalLoadingBarInactive()];
      })
    );
  });

  /** DELETE ENV */
  beginDeleteEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.beginDeleteEnv),
      switchMap(({ env }: EnvProp) => {
        return [RootActions.setGlobalLoadingBarActive(), EnvActions.finishDeleteEnv({ env })];
      })
    );
  });

  deleteEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.finishDeleteEnv),
      switchMap(({ env }: EnvProp ) => {
        return this.envsApi.deleteEnv(env);
      }),
      switchMap(({ env }: EnvProp) => {
        console.log("RESULT FOR DELETE ENV");
        console.log(env);
        this.snackbar.open(
          `Done deleting env '${env.getFormattedLabel()}'`
        );

        return [EnvActions.fetchAvailableEnvs(), RootActions.setGlobalLoadingBarInactive()];
      })
    );
  });

  /** START ENV */
  beginSpinupEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.beginSpinupEnv),
      switchMap(({ env }: EnvProp) => {
        return [RootActions.setGlobalLoadingBarActive(), EnvActions.finishSpinupEnv({ env })];
      })
    );
  });

  spinupEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.finishSpinupEnv),
      switchMap(({ env }: EnvProp) => {
        return this.dockerApi.upEnv(env);
      }),
      concatMap(({ env }: EnvProp) => {
        this.snackbar.open(
          `Done starting env '${env.getFormattedLabel()}'`
        );

        return [
          RootActions.fetchContainerStatusForEnv({ env }),
          RootActions.setGlobalLoadingBarInactive(),
        ];
      })
    );
  });

  beginSpinupContainer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.beginSpinupContainer),
      switchMap((data: ContainerProp) => {
        return [
          RootActions.setGlobalLoadingBarActive(),
          EnvActions.finishSpinupContainer(data),
        ];
      })
    );
  });

  spinupContainer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.finishSpinupContainer),
      switchMap(({ containerDef }: { containerDef: ContainerDefinition }) => {
        return this.dockerApi.upContainer(containerDef);
      }),
      concatMap(({ env, containerName }: DockerContainerActionResponse) => {
        this.snackbar.open(
          `Done spinning up '${containerName}'`
        );

        return [
          RootActions.fetchContainerStatusForEnv({ env }),
          RootActions.setGlobalLoadingBarInactive(),
        ];
      })
    );
  });

  /** SHUTDOWN ENV */
  beginShutdownEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.beginShutdownEnv),
      switchMap(({ env }: EnvProp) => {
        return [
          RootActions.setGlobalLoadingBarActive(),
          EnvActions.finishShutdownEnv({ env }),
        ];
      })
    );
  });

  shutdownEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.finishShutdownEnv),
      switchMap(({ env }: EnvProp) => {
        return this.dockerApi.downEnv(env);
      }),
      concatMap(({ env }: EnvProp) => {
        this.snackbar.open(
          `Done shutting down env '${env.getFormattedLabel()}'`
        );

        return [
          RootActions.fetchContainerStatusForEnv({ env }),
          RootActions.setGlobalLoadingBarInactive(),
        ];
      })
    );
  });

  beginShutdownContainer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.beginShutdownContainer),
      switchMap((data: ContainerProp) => {
        return [
          RootActions.setGlobalLoadingBarActive(),
          EnvActions.finishShutdownContainer(data),
        ];
      })
    );
  });

  shutdownContainer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EnvActions.finishShutdownContainer),
      switchMap(({ containerDef }: { containerDef: ContainerDefinition }) => {
        return this.dockerApi.downContainer(containerDef);
      }),
      concatMap(({ env, containerName }: DockerContainerActionResponse) => {
        this.snackbar.open(
          `Done shutting down container '${containerName}'`
        );

        return [
          RootActions.fetchContainerStatusForEnv({ env }),
          RootActions.setGlobalLoadingBarInactive(),
        ];
      })
    );
  });

  fetchDefinedContainersForEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RootActions.fetchContainerStatusForEnv),
      switchMap(({ env }: { env: Env}) => {
        return this.dockerApi.listDefined(env).pipe(
          concatLatestFrom(() => {
            return of(env);
          }),
          map(([containers, env]: [containers: ContainerDefinition[], env: Env]) =>
            EnvActions.setDefinedContainersForEnv({ env, containers })
          )
        );
      })
    );
  });

  fetchActiveContainersForEnv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RootActions.fetchContainerStatusForEnv),
      switchMap(({ env }: EnvProp) => {
        return this.dockerApi.listActive(env).pipe(
          concatLatestFrom(() => {
            return of(env);
          }),
          map(([containers, env]: [containers: ActiveContainer[], env: Env]) =>
            EnvActions.setActiveContainersForEnv({ env, containers })
          )
        );
      })
    );
  });

  copyConfigsForContainerAndType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RootActions.copyConfigsForContainerAndType),
      switchMap(({ containerDef, dataFileType }: ContainerAndDataFileTypeProp) => {
        return this.dockerApi.copyConfigs(containerDef, dataFileType)
      })
    )
  },
  { dispatch: false }
  );

  fetchBackupsForContainer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BackupActions.fetchBackupsForContainer),
      switchMap(({ containerDef }: ContainerProp) => {
        console.log("fetchBackupsForContainer$")
        return this.backupsApi.listBackups(containerDef).pipe(
          concatLatestFrom(() => {
            return of(containerDef);
          }),
          map(([backups, containerDef]: [backups: BackupDefinition[], containerDef: ContainerDefinition]) =>
            BackupActions.setBackupsForContainer({ containerDef, backups })
          )
        );
      })
    );
  });

  createNewBackupForContainer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BackupActions.createNewBackup),
      switchMap(({ containerDef }: ContainerProp) => {
        console.log("createNewBackupForContainer$")
        return this.backupsApi.createBackup(containerDef).pipe(
          concatLatestFrom(() => {
            return of(containerDef);
          }),
          map(([backups, containerDef]: [backups: BackupDefinition[], containerDef: ContainerDefinition]) =>
            BackupActions.setBackupsForContainer({ containerDef, backups })
          )
        );
      })
    );
  });
}
