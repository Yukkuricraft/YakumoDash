import { Component } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { DockerService } from "@app/services/docker/docker.service";
import { BackupsService } from "@app/services/backups/backups.service";
import { Store } from "@ngrx/store";
import { of, map, Observable, switchMap, BehaviorSubject } from "rxjs";
import {
  selectAvailableEnvs,
  selectBackupsForContainer,
  selectCurrentTabIndex,
  selectEnvByEnvString,
} from "@app/store/root.selectors";
import { selectDefinedContainerByName, selectDefinedContainersByEnvAndType } from "@app/store/root.selectors.containers";
import { Env } from "@app/models/env";
import {
  BackupActions,
  EnvActions,
} from "@app/store/root.actions";
import { ContainerDefinition, ContainerType } from "@app/models/container";
import { MatDialog } from "@angular/material/dialog";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from "../shared/confirmation-dialog/confirmation-dialog.component";
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  TextEditorDialogComponent,
  TextEditorDialogData,
  TextEditorDialogReturn,
} from "../shared/text-editor-dialog/text-editor-dialog.component";
import { isNil } from "lodash";
import { BackupDefinition } from "@app/models/backup";

@Component({
  selector: "app-backup-management",
  templateUrl: "./backup-management.component.html",
  styleUrls: ["./backup-management.component.scss"],
})
export class BackupManagementComponent {
  containerDef$: Observable<ContainerDefinition | null> = this.route.queryParams.pipe(
    switchMap((params: Params) => {
      const containerName = params["containerName"] ?? "";
      console.log(`containerDef$ - ${containerName}`);
      return this.store.select(selectDefinedContainerByName(containerName))
    }
  ))

  backups$: Observable<BackupDefinition[]> = this.containerDef$.pipe(
    switchMap((containerDef: ContainerDefinition | null) => {
      console.log("backups$");
      console.log(containerDef);
      return containerDef !== null ? this.store.select(selectBackupsForContainer(containerDef)) : of([]);
    })
  );;

  private dataSource = new MatTableDataSource<BackupDefinition>();
  backupsDataSource$: Observable<MatTableDataSource<BackupDefinition>> = this.backups$.pipe(
    map((backups) => {
      const dataSource: MatTableDataSource<BackupDefinition> = this.dataSource;
      dataSource.data = backups;
      console.log("backupsDataSource$");
      console.log(dataSource);
      return dataSource;
    })
  )

  displayedColumns = [ "date", "id", "tags" ];

  pageType: string = "BackupManagement";

  activeTabIndex$!: Observable<number | undefined>;
  activeEnv$!: Observable<Env>;
  activeEnv: Env | null = null;

  env$ = new BehaviorSubject(new Env());
  subPath$: BehaviorSubject<string> = new BehaviorSubject("/");

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store,
    private dockerApi: DockerService,
    private snackbar: MatSnackBar,
    private backupsApi: BackupsService
  ) {
    this.containerDef$.subscribe((containerDef: ContainerDefinition | null) => {
      console.log("aaaa")
      console.log("1");
      console.log(containerDef);
      if (containerDef !== null) {
        this.store.dispatch(BackupActions.fetchBackupsForContainer({ containerDef }));
      }
    });

    // this.backups$.subscribe((backups: BackupDefinition[]) => {
    //   console.log("3");
    //   this.backupsList = backups;
    // })

  }

  ngOnInit() {
    console.log("??")
    console.log(this.route.snapshot);
    console.log(this.route.snapshot.data);
    this.route.queryParams.subscribe(params => {
      const containerDef = window.history.state?.containerDef ?? null;
      console.log("this.route.queryParams.subscribe()");
      console.log(params);
      console.log(containerDef);

      if (containerDef == null) {
        return;
      }

      // this.containerDef$ = new BehaviorSubject(containerDef);
      console.log("CONTAINER DEF HELLO?");
      console.log(window.history.state);
      // this.env$.next(containerDef.env);
    });
  }

}
