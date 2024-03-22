import { Component, Input, Inject } from "@angular/core";
import { isNil } from "lodash";
import { map, Observable } from "rxjs";
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
export class BackupsManagementDialogComponent {
  private dataSource = new MatTableDataSource<BackupDefinition>();
  backupsDataSource$!: Observable<MatTableDataSource<BackupDefinition>>;

  displayedColumns = [ "date", "id", "tags" ];

  pageType: string = "BackupManagement";

  activeTabIndex$!: Observable<number | undefined>;
  activeEnv$!: Observable<Env>;
  activeEnv: Env | null = null;

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

    this.backupsDataSource$ = this.backupsFacade.getBackupsList$().pipe(
      map((backups: BackupDefinition[] | undefined) => {
        if (backups === undefined) {
          console.warn("Got back an undefined backups list! This shouldn't be possible.");
          backups = [];
        }
        const dataSource: MatTableDataSource<BackupDefinition> = this.dataSource;
        dataSource.data = backups;
        console.log("backupsDataSource$");
        console.log(dataSource);
        return dataSource;
      })
    )
  }

  backupChoiceSelected(backupDef: BackupDefinition) {
    return this.backupsFacade.onBackupChoiceSelected(this.containerDef, backupDef);
  }

  ngOnInit(): void {
    this.backupsFacade.onInitBackupsComponent(this.containerDef);
  }

  ngOnDestroy(): void {
    this.backupsFacade.onDestroyBackupsComponent(this.containerDef);
  }
}
