import { Component } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { DockerService } from "@app/services/docker/docker.service";
import { BackupsService } from "@app/services/backups/backups.service";
import { Store } from "@ngrx/store";
import { of, tap, map, Observable, switchMap, concatMap, exhaustMap, BehaviorSubject } from "rxjs";
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
  containerDef$!: Observable<ContainerDefinition | null>;
  backups$!: Observable<BackupDefinition[]>;
  private dataSource = new MatTableDataSource<BackupDefinition>();
  backupsDataSource$!: Observable<MatTableDataSource<BackupDefinition>>;

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
  }

  ngOnInit() {
    console.log("??")
    console.log(this.route.snapshot);
    console.log(this.route.snapshot.data);

    // TODO: Router store selectors
    this.containerDef$ = this.route.queryParams.pipe(
      exhaustMap((params: Params) => {
        const containerName = params["containerName"] ?? "";
        console.log(`containerDef$ - ${containerName}`);
        return this.store.select(selectDefinedContainerByName(containerName));
      }
    ));

    this.containerDef$.subscribe((containerDef: ContainerDefinition | null) => {
      console.log("aaaa")
      console.log("1");
      console.log(containerDef);
      if (containerDef !== null) {
        this.store.dispatch(BackupActions.fetchBackupsForContainer({ containerDef }));
      }
    });

    this.backups$ = this.containerDef$.pipe(
      concatMap((containerDef: ContainerDefinition | null) => {
        console.log("backups$");
        console.log(containerDef);
        return this.store.select(selectBackupsForContainer(containerDef));
      })
    );;


    this.backupsDataSource$ = this.backups$.pipe(
      map((backups: BackupDefinition[]) => {
        const dataSource: MatTableDataSource<BackupDefinition> = this.dataSource;
        dataSource.data = backups;
        console.log("backupsDataSource$");
        console.log(dataSource);
        return dataSource;
      })
    )
  }
}
