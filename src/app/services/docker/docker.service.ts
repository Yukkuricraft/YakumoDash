import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { DomainConverter } from "@app/helpers/domain";
import { lowercaseKeys } from "@app/helpers/case";
import { Env, CreateEnvResponse } from "@app/models/env";
import { DockerContainerActionResponse, DockerEnvActionResponse } from "@app/models/docker";
import { ActiveContainer, ConfigType, ContainerDefinition } from "@app/models/container";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DockerService {
  private basePath: string = `https://${environment.API_HOST}/server`;

  constructor(private http: HttpClient) {}

  upEnv(env: Env) {
    return this.http
      .post(`${this.basePath}/${env.name}/containers/up`, {})
      .pipe(
        map((data: any) =>
          DomainConverter.fromDto(DockerEnvActionResponse, data)
        )
      );
  }

  upContainer(containerDef: ContainerDefinition, env: Env) {
    return this.http
      .post(`${this.basePath}/${env.name}/containers/up_one`, {
        container_name: containerDef.getHostname(),
      })
      .pipe(
        map((data: any) =>
          DomainConverter.fromDto(DockerContainerActionResponse, data)
        )
      );
  }

  downEnv(env: Env) {
    return this.http
      .post(`${this.basePath}/${env.name}/containers/down`, {})
      .pipe(
        map((data: any) =>
          DomainConverter.fromDto(DockerEnvActionResponse, data)
        )
      );
  }

  downContainer(containerDef: ContainerDefinition, env: Env) {
    return this.http
      .post(`${this.basePath}/${env.name}/containers/down_one`, {
        container_name: containerDef.getHostname(),
      })
      .pipe(
        map((data: any) =>
          DomainConverter.fromDto(DockerContainerActionResponse, data)
        )
      );
  }

  restartEnv(env: Env) {
    console.log("Restart Env not implemented")
    return this.http.post(`${this.basePath}/${env.name}/containers/restart`, {});
  }

  copyConfigs(containerDef: ContainerDefinition, env: Env, configType: ConfigType) {
    console.log(containerDef);
    const hostname = containerDef.getHostname();

    return this.http
      .post(`${this.basePath}/${env.name}/containers/copy-configs-to-bindmount`, {
        container_name: hostname,
        config_type: configType,
      })
  }

  listDefined(env: Env) {
    return this.http
      .get(`${this.basePath}/${env.name}/containers`)
      .pipe(
        map((data: any) =>
          data.map((obj: any) =>
            DomainConverter.fromDto(ContainerDefinition, obj)
          )
        )
      );
  }

  listActive(env: Env) {
    return this.http
      .get(`${this.basePath}/${env.name}/containers/active`)
      .pipe(
        map((data: any) =>
          data.map((obj: any) =>
            DomainConverter.fromDto(ActiveContainer, lowercaseKeys(obj))
          )
        )
      );
  }
}
