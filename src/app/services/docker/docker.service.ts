import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { SocialUser } from "@abacritt/angularx-social-login";
import { HttpClient } from "@angular/common/http";
import { DomainConverter } from "@app/helpers/domain";
import { ILoginRequest, ILoginReturn } from "@app/models/auth";
import { Container } from "@app/models/container";
import { lowercaseKeys } from "@app/helpers/case";
import { Env } from "@app/models/env";

const accessTokenName = 'auth.yakumo.access_token';

@Injectable({
  providedIn: 'root'
})
export class DockerService {
  private basePath: string = 'https://api2.yukkuricraft.net';

  constructor(private http: HttpClient) { }

  list(env: Env) {
    return this.http
      .get(`${this.basePath}/docker/${env.name}/containers`)
      .pipe(map((data: any) =>
        data.map((obj: any) =>
          DomainConverter.fromDto(Container, lowercaseKeys(obj))
        )
      ))
  }
}
