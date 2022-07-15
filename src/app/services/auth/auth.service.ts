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
export class AuthService {
  private basePath: string = 'https://api2.yukkuricraft.net';
  private _accessToken: string | null = null;

  constructor(private http: HttpClient) { }

  get accessToken(): string | null {
    if (!this._accessToken) {
      this._accessToken = sessionStorage.getItem(accessTokenName);
    }

    return this._accessToken;
  }

  set accessToken(token: string | null) {
    if (token === null) {
      sessionStorage.setItem(accessTokenName, 'false');
      this._accessToken = null;
    } else {
      sessionStorage.setItem(accessTokenName, token);
      this._accessToken = token;
    }
  }

  me(): Observable<SocialUser | null> {
    return this.http
      .get(`${this.basePath}/auth/me`)
      .pipe(map((data) => DomainConverter.fromDto(SocialUser, data)));
  }

  login(body: ILoginRequest): Observable<ILoginReturn> {
    return this.http
      .post<ILoginReturn>(`${this.basePath}/auth/login`, body)
      .pipe(map((data: ILoginReturn) => {
        console.log(data)
        this.accessToken = `${data.access_token }`;
        return data
    }))
  }

}
