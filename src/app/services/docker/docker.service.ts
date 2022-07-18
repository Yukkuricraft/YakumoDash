import { Injectable } from '@angular/core';
import { map, Observable } from "rxjs";
import { SocialUser } from "@abacritt/angularx-social-login";
import { HttpClient } from "@angular/common/http";
import { DomainConverter } from "@app/helpers/domain";
import { ILoginRequest, ILoginReturn } from "@app/models/auth";

const accessTokenName = 'auth.yakumo.access_token';

@Injectable({
  providedIn: 'root'
})
export class DockerService {
  private basePath: string = 'https://api2.yukkuricraft.net';

  constructor(private http: HttpClient) { }

  list() {
    return this.http
      .get(`${this.basePath}/docker/prod/containers`)
  }

}
