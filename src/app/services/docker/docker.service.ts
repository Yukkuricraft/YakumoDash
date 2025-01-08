import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { DomainConverter } from "@app/helpers/domain";
import { lowercaseKeys } from "@app/helpers/case";
import { Env } from "@app/models/env";
import {
  DockerContainerActionResponse,
  DockerEnvActionResponse,
} from "@app/models/docker";
import { ActiveContainer, ContainerDefinition } from "@app/models/container";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DockerService {
  private basePath: string = `${environment.PROTOCOL}://${environment.API_HOST}/server`;

  constructor(private http: HttpClient) {}
  prepareForWsAttach(
    activeContainer: ActiveContainer
  ): Observable<DockerContainerActionResponse> {
    return this.http
      .post(
        `${
          this.basePath
        }/container/${activeContainer.getHostname()}/prepare_ws_attach`,
        {}
      )
      .pipe(
        map((data: any) =>
          DomainConverter.fromDto(DockerContainerActionResponse, data)
        )
      );
  }

  upEnv(env: Env): Observable<DockerEnvActionResponse> {
    console.log("DockerService.upEnv asdf");
    return this.http
      .post(`${this.basePath}/cluster/${env.name}/up`, {})
      .pipe(
        map((data: any) =>
          DomainConverter.fromDto(DockerEnvActionResponse, data)
        )
      );
  }

  upContainer(
    containerDef: ContainerDefinition
  ): Observable<DockerContainerActionResponse> {
    return this.http
      .post(`${this.basePath}/container/${containerDef.getHostname()}/up`, {})
      .pipe(
        map((data: any) =>
          DomainConverter.fromDto(DockerContainerActionResponse, data)
        )
      );
  }

  downEnv(env: Env): Observable<DockerEnvActionResponse> {
    return this.http
      .post(`${this.basePath}/cluster/${env.name}/down`, {})
      .pipe(
        map((data: any) =>
          DomainConverter.fromDto(DockerEnvActionResponse, data)
        )
      );
  }

  downContainer(
    containerDef: ContainerDefinition
  ): Observable<DockerContainerActionResponse> {
    return this.http
      .post(`${this.basePath}/container/${containerDef.getHostname()}/down`, {
        container_name: containerDef.getHostname(),
      })
      .pipe(
        map((data: any) =>
          DomainConverter.fromDto(DockerContainerActionResponse, data)
        )
      );
  }

  restartEnv(env: Env) {
    console.log("Restart Env not implemented");
    return this.http.post(`${this.basePath}/clusters/${env.name}/restart`, {});
  }

  listDefined(env: Env) {
    return this.http.get(`${this.basePath}/cluster/${env.name}/defined`).pipe(
      map((data: any) =>
        data.defined_containers.map((obj: any) => {
          let containerDef = DomainConverter.fromDto<ContainerDefinition>(
            ContainerDefinition,
            obj,
            {
              caseOptions: {
                excludeValuesForKeys: ["labels"],
              },
            }
          );
          containerDef.env = env;
          return containerDef;
        })
      )
    );
  }

  listActive(env: Env) {
    return this.http.get(`${this.basePath}/cluster/${env.name}/active`).pipe(
      map((data: any) =>
        data.active_containers.map((obj: any) => {
          let activeContainer = DomainConverter.fromDto<ActiveContainer>(
            ActiveContainer,
            lowercaseKeys(obj),
            {
              caseOptions: {
                excludeValuesForKeys: ["labels"],
              },
            }
          );
          activeContainer.env = env;
          return activeContainer;
        })
      )
    );
  }
}
