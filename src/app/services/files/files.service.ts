import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap } from "rxjs";
import _ from "lodash";
import { DomainConverter } from "@app/helpers/domain";
import { CreateEnvResponse, Env } from "@app/models/env";
import { DockerEnvActionResponse } from "@app/models/docker";

@Injectable({
  providedIn: "root",
})
export class FilesService {
  private basePath: string = "https://api2.yukkuricraft.net/files";

  constructor(private http: HttpClient) {}

  writeFile(file: string, content: string) {
    console.log(file, content);
    return this.http.post(`${this.basePath}/write`, {
      FILE_PATH: file,
      CONTENT: content,
    });
  }

  readFile(file: string) {
    console.log(file);
    return this.http.post(`${this.basePath}/read`, {
      FILE_PATH: file,
    });
  }
}
