import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap, Observable } from "rxjs";
import { DomainConverter } from "@app/helpers/domain";
import { CreateEnvResponse, Env } from "@app/models/env";
import { DockerEnvActionResponse } from "@app/models/docker";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EnvironmentsService {
  private basePath: string = `${environment.PROTOCOL}://${environment.API_HOST}/environments`;

  constructor(private http: HttpClient) {}

  createEnv(
    proxyPort: number,
    envAlias: string,
    enableEnvProtection: boolean,
    serverType: string,

    description?: string
  ): Observable<CreateEnvResponse> {
    return this.http
      .post(`${this.basePath}/create`, {
        PROXY_PORT: proxyPort,
        ENV_ALIAS: envAlias,
        ENABLE_ENV_PROTECTION: enableEnvProtection,
        SERVER_TYPE: serverType,
        DESCRIPTION: description,
      })
      .pipe(
        map((data: any) => DomainConverter.fromDto(CreateEnvResponse, data))
      );
  }

  deleteEnv(env: Env) {
    return this.http.delete(`${this.basePath}/${env.name}`).pipe(
      map((data: any) =>
        // TODO: Refactor api side to use a py script and not a bash script. Change return sig accordingly
        DomainConverter.fromDto(DockerEnvActionResponse, data)
      )
    );
  }

  regenerateEnvConfigs(env: Env) {
    return this.http
      .post(`${this.basePath}/${env.name}/generate/configs`, {})
      .pipe(
        map((data: any) =>
          // TODO: Refactor api side to use a py script and not a bash script. Change return sig accordingly
          DomainConverter.fromDto(DockerEnvActionResponse, data)
        )
      );
  }

  listEnvsWithConfigs() {
    return this.http
      .get<any>(`${this.basePath}/list`)
      .pipe(
        map(resp =>
          resp.envs.map((env: object) => DomainConverter.fromDto(Env, env))
        )
      );
  }
}
