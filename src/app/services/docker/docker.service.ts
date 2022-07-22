import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { SocialUser } from "@abacritt/angularx-social-login";
import { HttpClient } from "@angular/common/http";
import { DomainConverter } from "@app/helpers/domain";
import { ILoginRequest, ILoginReturn } from "@app/models/auth";
import { Container } from "@app/models/server";

const accessTokenName = 'auth.yakumo.access_token';

@Injectable({
  providedIn: 'root'
})
export class DockerService {
  private basePath: string = 'https://api2.yukkuricraft.net';

  constructor(private http: HttpClient) { }

  lowercaseKeys(obj: any) {
    return Object.fromEntries(Object.entries(obj).map(
      ([key, value]) => [key.charAt(0).toLowerCase(), key.slice(1), value]
    ));
  }

  list(env: string) {
    return this.http
      .get(`${this.basePath}/docker/${env}/containers`)
      .pipe(map((data: any) =>
        data.map((obj: any) =>
          DomainConverter.fromDto(Container, this.lowercaseKeys(obj))
        )
      ))
  }
}
