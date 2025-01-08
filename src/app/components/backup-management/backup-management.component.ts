import { Component, OnInit, OnDestroy, Input, Inject } from "@angular/core";
import { isNil } from "lodash-es";
import { take, map, mergeMap, filter, switchMap, Observable, takeLast, BehaviorSubject, merge, combineLatest } from "rxjs";
import { Env } from "@app/models/env";
import { ActiveContainer, ContainerDefinition, ContainerStates, DockerContainerState } from "@app/models/container";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { BackupDefinition } from "@app/models/backup";
import { BackupsFacade } from "@app/store/backups/backups.facade";

export type BackupsManagementDialogData = {
  title?: string;
  containerDef: ContainerDefinition;
  containerRunning$: BehaviorSubject<boolean>;
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

  worlds$: Observable<string[]>;
  worldsToRestore$ = new BehaviorSubject<string[]>([]);
  worldsLength$: Observable<number>;

  containerDef: ContainerDefinition;
  containerRunning$: Observable<boolean>;
  preBypassRunningContainerRestriction$ = new BehaviorSubject<boolean>(false);
  bypassRunningContainerRestriction$ = new BehaviorSubject<boolean>(false);

  isConfirmBackupButtonDisabled$: Observable<boolean>;

  confirmBackupDisabledTooltipText = "You must select at least one world to restore AND the container must be stopped UNLESS the bypass checkbox is ticked."
  confirmBackupEnabledTooltipText = "Start rollback"

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
    this.containerRunning$ = data!.containerRunning$.asObservable();

    this.isBackupSelected$ = this.backupsFacade.isBackupChoiceSelected$();
    this.areBackupsReadyToRender$ = this.backupsFacade.isBackupsReadyToRender$();
    this.selectedBackup$ = this.backupsFacade.getBackupChoice$();

    this.worlds$ = this.backupsFacade.getSnapshotWorlds$();
    this.worlds$.subscribe((data: any) => { console.log("WORLDS LIST"); console.log(data); });
    this.worldsLength$ = this.worldsToRestore$.pipe(
      filter((worlds: string[] | null): worlds is string[] => {
        return worlds !== null;
      }),
      map((worlds) => worlds.length),
    )

    this.backupsList$ = this.backupsFacade.getBackupsList$();
    this.backupsList$.subscribe((data: any) => { console.log("BACKUPS LIST SUBSCRIPTION"); console.log(data) });
    this.backupsDataSource$ = this.backupsList$.pipe(
      map((backups: BackupDefinition[]) => {
        const dataSource: MatTableDataSource<BackupDefinition> = this.dataSource;
        dataSource.data = backups;
        return dataSource;
      })
    )

    this.isConfirmBackupButtonDisabled$ = combineLatest([
      this.containerRunning$,
      this.worlds$,
      this.bypassRunningContainerRestriction$,
    ]).pipe(
      map(([containerRunning, worldsToRestore, bypassRunningContainerRestrictions]) => {
         if (worldsToRestore.length === 0) {
          // If no worlds are selected to restore
          return true;
        } else if (containerRunning && !bypassRunningContainerRestrictions) {
          // If container is running and user did NOT bypass
          return true;
        }

        // Otherwise should be good to proceed with a restore.
        return false;
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

    this.preBypassRunningContainerRestriction$.next(false);
    this.bypassRunningContainerRestriction$.next(false);
  }

  handleSelectedWorldChange({ worlds }: any) {
    this.worldsToRestore$.next(worlds);
  }

  backupChoiceConfirmed() {
    this.selectedBackup$.pipe(
      take(1)
    ).subscribe((backupChoice: BackupDefinition | null) => {
        if (backupChoice === null) {
          console.warn("backupChoiceConfirmed called but backupChoice was null!");
          return;
        }

        this.backupsFacade.onBackupChoiceConfirmed(this.containerDef, backupChoice, this.worldsToRestore$.getValue(), this.bypassRunningContainerRestriction$.getValue());
      }
    )
  }

  createNewBackup() {
    this.backupsFacade.onCreateBackupButtonClicked(this.containerDef);
  }

  deselectBackupChoice() {
    this.backupsFacade.onDeselectBackupChoice(this.containerDef);
  }

  onPreBypassClicked(val: boolean) {
    this.preBypassRunningContainerRestriction$.next(val);
  }
  onBypassClicked(val: boolean) {
    this.bypassRunningContainerRestriction$.next(val);
  }
}
