import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap, of, Observable } from "rxjs";
import { DomainConverter } from "@app/helpers/domain";
import { CreateEnvResponse, Env } from "@app/models/env";
import { DockerEnvActionResponse } from "@app/models/docker";
import { environment } from "src/environments/environment";
import { ContainerDefinition } from "@app/models/container";
import { BackupDefinition } from "@app/models/backup";

@Injectable({
  providedIn: "root",
})
export class BackupsService {
  private basePath: string = `https://${environment.API_HOST}/backups`;

  constructor(private http: HttpClient) {}

  listBackups(container: ContainerDefinition): Observable<BackupDefinition[]> {
    console.log("Poop");
    return of([
      { date: new Date('1995-12-17T03:24:00'), id: 'abc', tags: ['1', '2']},
      { date: new Date('2024-12-17T03:24:00'), id: 'abc', tags: ['2', '3']},
    ]);
  }
}
