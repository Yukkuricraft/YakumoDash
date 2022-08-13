import { Injectable } from '@angular/core';
import { map, Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { DomainConverter } from "@app/helpers/domain";
import { lowercaseKeys } from "@app/helpers/case";
import { Env } from "@app/models/env";
import { ActiveContainer, ContainerDefinition } from "@app/models/container";

@Injectable({
  providedIn: 'root'
})
export class DockerService {
  private basePath: string = 'https://api2.yukkuricraft.net';

  constructor(private http: HttpClient) { }

  listDefined(env: Env) {
    return this.http
      .get(`${this.basePath}/docker/${env.name}/containers`)
      .pipe(tap(console.log), map((data: any) =>
        data.map((obj: any) => DomainConverter.fromDto(ContainerDefinition, obj))
      ))
  }

  listActive(env: Env) {
    return this.http
      .get(`${this.basePath}/docker/${env.name}/containers/active`)
      .pipe(map((data: any) =>
        data.map((obj: any) => DomainConverter.fromDto(ActiveContainer, lowercaseKeys(obj)))
      ), tap(console.log))
  }
}
