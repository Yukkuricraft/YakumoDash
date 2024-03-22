import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap, of, Observable } from "rxjs";
import { DomainConverter } from "@app/helpers/domain";
import { CreateEnvResponse, Env } from "@app/models/env";
import { DockerEnvActionResponse } from "@app/models/docker";
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
  private basePath: string = `https://${environment.API_HOST}/backups`;

  constructor(private http: HttpClient) {}

  listBackups(container: ContainerDefinition): Observable<BackupDefinition[]> {
    console.log("Poop");
    // return of([
    //   { time: new Date('1995-12-17T03:24:00'), id: 'abc', tags: ['1', '2']},
    //   { time: new Date('2024-12-17T03:24:00'), id: 'abc', tags: ['2', '3']},
    // ]);

    console.log("?")
    return this.http
      .post(`${this.basePath}/list-by-tags`, {
        env_str: container.env.name,
        target_tags: [container.getContainerNameLabel()],
      })
      .pipe(
        map((data: any) =>
          data.map((obj: any) => {
            return DomainConverter.fromDto<BackupDefinition>(BackupDefinition, lowercaseKeys(obj));
          })
        )
      );
  }

  createBackup(container: ContainerDefinition) {
    console.log("Creating backup?")

    return this.http
      .post(`${this.basePath}/create-new-minecraft-backup`, {
        target_env: container.env.name,
        target_world_group: container.getContainerNameLabel(),
      })
  }

  restoreBackup(backup: BackupDefinition) {
    console.log("Creating backup?")

    return this.http
      .post(`${this.basePath}/restore-minecraft-backup`, {
        target_hostname: backup.hostname,
        target_snapshot_id: backup.id,
      })
  }
}
