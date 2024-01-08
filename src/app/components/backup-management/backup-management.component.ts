import { Component } from "@angular/core";
import { DockerService } from "@app/services/docker/docker.service";
import { BackupsService } from "@app/services/backups/backups.service";
import { Store } from "@ngrx/store";
import { of, map, Observable, switchMap } from "rxjs";
import {
  selectAvailableEnvs,
  selectBackupsForContainer,
  selectCurrentTabIndex,
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
  ContainerType = ContainerType;

  backupsList: BackupDefinition[] = [];

  displayedColumns = [ "date", "id", "tags" ];

  pageType: string = "BackupManagement";

  activeTabIndex$!: Observable<number | undefined>;
  activeEnv$!: Observable<Env>;
  activeEnv: Env | null = null;

  containerDef$: Observable<ContainerDefinition | null> = of(new ContainerDefinition());
  backups$: Observable<BackupDefinition[]> = of([]);

  constructor(
    public dialog: MatDialog,
    private store: Store,
    private dockerApi: DockerService,
    private snackbar: MatSnackBar,
    private backupsApi: BackupsService
  ) {
    this.containerDef$ = this.store.select(selectDefinedContainerByName("YC-env3-survival"));

    this.containerDef$.subscribe((containerDef: ContainerDefinition | null) => {
      console.log("1");
      console.log(containerDef);
      if (containerDef !== null) {
        this.store.dispatch(BackupActions.fetchBackupsForContainer({ containerDef }));
      }
    });

    this.backups$ = this.containerDef$.pipe(
      switchMap((containerDef: ContainerDefinition | null) => {
        console.log("2");
        console.log(containerDef);
        return containerDef !== null ? this.store.select(selectBackupsForContainer(containerDef)) : [];
      })
    );

    this.backups$.subscribe((backups: BackupDefinition[]) => {
      console.log("3");
      this.backupsList = backups;
    })

  }
}
