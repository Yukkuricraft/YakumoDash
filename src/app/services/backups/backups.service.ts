import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap, of, Observable } from "rxjs";
import { DomainConverter } from "@app/helpers/domain";
import { environment } from "src/environments/environment";
import { ContainerDefinition } from "@app/models/container";
import { BackupDefinition } from "@app/models/backup";
import { lowercaseKeys } from "@app/helpers/case";

export interface RestoreBackupApiResponse {
  success: boolean,
  output: string,
};

@Injectable({
  providedIn: "root",
})
export class BackupsService {
  private basePath: string = `${environment.PROTOCOL}://${environment.API_HOST}/backups`;

  constructor(private http: HttpClient) {}

  listBackups(container: ContainerDefinition): Observable<BackupDefinition[]> {
    return this.http
      .post(`${this.basePath}/list`, {
        env_str: container.env.name,
        target_tags: [container.getContainerNameLabel()],
      })
      .pipe(
        map((data: any) =>
          data.backups.map((obj: any) => {
            return DomainConverter.fromDto<BackupDefinition>(BackupDefinition, lowercaseKeys(obj));
          })
        )
      );
  }

  listSnapshotWorlds(backup: BackupDefinition): Observable<string[]> {
    return this.http
      .get(`${this.basePath}/snapshot/${backup.shortId}/worlds`)
      .pipe(
        map(({ worlds }: any) =>
            worlds
        )
      );
  }

  createBackup(container: ContainerDefinition) {
    console.log("Creating backup?")

    return this.http
      .post(`${this.basePath}/create`, {
        target_env: container.env.name,
        target_world_group: container.getContainerNameLabel(),
      })
  }

  restoreBackup(backup: BackupDefinition, worlds: string[], bypassRunningContainerRestriction: boolean) {
    console.log("Restoring backup?");

    return this.http
      .post(`${this.basePath}/restore`, {
        target_hostname: backup.hostname,
        target_snapshot_id: backup.id,
        target_worlds: worlds,
        bypass_running_container_restriction: bypassRunningContainerRestriction,
      })
  }
}
