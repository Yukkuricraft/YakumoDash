import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs";
import _ from 'lodash';
import { DomainConverter } from "@app/helpers/domain";
import { Env } from "@app/models/env";

@Injectable({
  providedIn: 'root'
})
export class EnvironmentsService {

  private basePath: string = 'https://api2.yukkuricraft.net';

  constructor(private http: HttpClient) { }

  listEnvsWithConfigs() {
    return this.http
      .get<any[]>(`${this.basePath}/environments/list-envs-with-configs`).pipe(
        map((envs ) =>
          envs.map((env) => DomainConverter.fromDto(Env, env))
        ),
        tap(console.log),
      )
  }
}
