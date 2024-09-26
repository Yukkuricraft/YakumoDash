import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { DomainConverter } from "@app/helpers/domain";
import { lowercaseKeys } from "@app/helpers/case";
import { Env, CreateEnvResponse } from "@app/models/env";
import { DockerContainerActionResponse, DockerEnvActionResponse } from "@app/models/docker";
import { ActiveContainer, DataDirType, ContainerDefinition } from "@app/models/container";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DockerService {
  private basePath: string = `${environment.PROTOCOL}://${environment.API_HOST}/server`;

  constructor(private http: HttpClient) {}
  upEnv(env: Env): Observable<DockerEnvActionResponse> {
    console.log("DockerService.upEnv asdf");
    return this.http
      .post(`${this.basePath}/${env.name}/containers/up`, {})
      .pipe(
        map((data: any) =>
          DomainConverter.fromDto(DockerEnvActionResponse, data)
        )
      );
  }

  upContainer(containerDef: ContainerDefinition): Observable<DockerContainerActionResponse> {
    return this.http
      .post(`${this.basePath}/${containerDef.env.name}/containers/up_one`, {
        container_name: containerDef.getHostname(),
      })
      .pipe(
        map((data: any) =>
          DomainConverter.fromDto(DockerContainerActionResponse, data)
        )
      );
  }

  downEnv(env: Env): Observable<DockerEnvActionResponse> {
    return this.http
      .post(`${this.basePath}/${env.name}/containers/down`, {})
      .pipe(
        map((data: any) =>
          DomainConverter.fromDto(DockerEnvActionResponse, data)
        )
      );
  }

  downContainer(containerDef: ContainerDefinition): Observable<DockerContainerActionResponse> {
    return this.http
      .post(`${this.basePath}/${containerDef.env.name}/containers/down_one`, {
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

  copyConfigs(containerDef: ContainerDefinition, dataFileType: DataDirType) {
    const hostname = containerDef.getHostname();

    return this.http
      .post(`${this.basePath}/containers/copy-configs-to-bindmount`, {
        container_name: hostname,
        data_file_type: dataFileType,
      })
  }

  listDefined(env: Env) {
    return this.http
      .get(`${this.basePath}/${env.name}/containers`)
      .pipe(
        map((data: any) =>
          data.map((obj: any) => {
            let containerDef = DomainConverter.fromDto<ContainerDefinition>(ContainerDefinition, obj, {
              caseOptions: {
                excludeValuesForKeys: [
                  "labels",
                ]
              }
            })
            containerDef.env = env;
            return containerDef;
          })
        )
      );
  }

  listActive(env: Env) {
    return this.http
      .get(`${this.basePath}/${env.name}/containers/active`)
      .pipe(
        map((data: any) =>
          data.map((obj: any) => {
            let activeContainer = DomainConverter.fromDto<ActiveContainer>(ActiveContainer, lowercaseKeys(obj), {
              caseOptions: {
                excludeValuesForKeys: [
                  "labels",
                ]
              }
            })
            activeContainer.env = env;
            return activeContainer;
          })
        )
      );
  }
}
