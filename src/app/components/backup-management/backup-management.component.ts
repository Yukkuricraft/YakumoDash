import { Component, OnInit, OnDestroy, Input, Inject } from "@angular/core";
import { isNil } from "lodash";
import { map, mergeMap, filter, Observable, takeLast } from "rxjs";
import { Env } from "@app/models/env";
import { ContainerDefinition } from "@app/models/container";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { BackupDefinition } from "@app/models/backup";
import { BackupsFacade } from "@app/store/backups/backups.facade";

export type BackupsManagementDialogData = {
  title?: string;
  containerDef: ContainerDefinition;
  extraActionPrompt?: string;
};

export type BackupsManagementDialogReturn = {
  result: boolean;
  extraActionResult: boolean | null;
};

@Component({
  selector: "app-backup-management",
  templateUrl: "./backup-management.component.html",
  styleUrls: ["./backup-management.component.scss"],
})
export class BackupsManagementDialogComponent implements OnInit, OnDestroy {
  public selectedBackup$: Observable<BackupDefinition | null>;
  public backupsList$: Observable<BackupDefinition[]>;
  public areBackupsReadyToRender$: Observable<boolean>;
  public isBackupSelected$: Observable<boolean>;

  private dataSource = new MatTableDataSource<BackupDefinition>();
  backupsDataSource$!: Observable<MatTableDataSource<BackupDefinition>>;

  displayedColumns = ["date", "id", "tags"];
  pageType: string = "BackupManagement";

  containerDef: ContainerDefinition;

  constructor(
    public dialogRef: MatDialogRef<
      BackupsManagementDialogComponent,
      BackupsManagementDialogReturn
    >,
    private backupsFacade: BackupsFacade,
    @Inject(MAT_DIALOG_DATA) public data?: BackupsManagementDialogData,
  ) {

    if (isNil(data)) {
      throw new Error("Got an empty MAT_DIALOG_DATA in BackupsManagementDialogComponent. Aborting")
    }

    this.containerDef = data!.containerDef;
    this.isBackupSelected$ = this.backupsFacade.isBackupChoiceSelected$();
    this.areBackupsReadyToRender$ = this.backupsFacade.isBackupsReadyToRender$();
    this.selectedBackup$ = this.backupsFacade.getBackupChoice$();
    this.backupsList$ = this.backupsFacade.getBackupsList$();
    this.backupsList$.subscribe((data: any) => { console.log("BACKUPS LIST SUBSCRIPTION"); console.log(data) });
    this.backupsDataSource$ = this.backupsList$.pipe(
      map((backups: BackupDefinition[]) => {
        const dataSource: MatTableDataSource<BackupDefinition> = this.dataSource;
        dataSource.data = backups;

        console.log("backupsDataSource$");
        console.log(dataSource);

        return dataSource;
      })
    )
  }

  ngOnInit(): void {
    this.backupsFacade.onInitBackupsComponent(this.containerDef);
  }

  ngOnDestroy(): void {
    this.backupsFacade.onDestroyBackupsComponent(this.containerDef);
  }

  backupChoiceSelected(backupDef: BackupDefinition) {
    this.backupsFacade.onBackupChoiceSelected(this.containerDef, backupDef);
  }

  backupChoiceConfirmed() {
    this.backupsFacade.onBackupChoiceConfirmed();
  }

  deselectBackupChoice() {
    this.backupsFacade.onDeselectBackupChoice(this.containerDef);
  }
}
