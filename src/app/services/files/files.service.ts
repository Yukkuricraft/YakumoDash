import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap } from "rxjs";
import { DomainConverter } from "@app/helpers/domain";
import { CreateEnvResponse, Env } from "@app/models/env";
import { DockerEnvActionResponse } from "@app/models/docker";
import { FileListResponse } from "@app/models/file";

@Injectable({
  providedIn: "root",
})
export class FilesService {
  private basePath: string = "https://api2.yukkuricraft.net/files";

  constructor(private http: HttpClient) {}

  listFiles(path: string) {
    return this.http
      .post(`${this.basePath}/list`, {
        PATH: path,
      })
      .pipe(
        map((data: any) => DomainConverter.fromDto(FileListResponse, data))
      );
  }

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
