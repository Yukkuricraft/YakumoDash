import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, tap } from "rxjs";
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { HttpClient } from "@angular/common/http";
import { DomainConverter } from "@app/helpers/domain";
import {
  ILoginRequest,
  ILoginReturn,
  ILogoutRequest,
  ILogoutReturn,
} from "@app/models/auth";
import { Store } from "@ngrx/store";
import { IUser, User } from "@app/models/user";

const accessTokenName = "auth.yakumo.access_token";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private basePath: string = "https://api2.yukkuricraft.net/auth";
  private _accessToken: string | null = null;

  constructor(
    private http: HttpClient,
    private store: Store,
    private socialAuthService: SocialAuthService
  ) {}

  get accessToken(): string | null {
    if (!this._accessToken) {
      this._accessToken = sessionStorage.getItem(accessTokenName);
    }

    return this._accessToken;
  }

  set accessToken(token: string | null) {
    if (token === null) {
      sessionStorage.setItem(accessTokenName, "false");
      this._accessToken = null;
    } else {
      sessionStorage.setItem(accessTokenName, token);
      this._accessToken = token;
    }
  }

  me(): Observable<IUser | null> {
    // TODO: TYPES FOR FAILURE CASE
    return this.http
      .get(`${this.basePath}/me`)
      .pipe(map(data => DomainConverter.fromDto(User, data)));
  }

  login(body: ILoginRequest): Observable<ILoginReturn> {
    return this.http.post<ILoginReturn>(`${this.basePath}/login`, body).pipe(
      tap((data: ILoginReturn) => {
        this.accessToken = `${data.access_token}`;
      }),
      catchError(err => {
        console.log(err);
        return of();
      })
    );
  }

  logout(): Observable<ILogoutReturn> {
    const body: ILogoutRequest = { access_token: this.accessToken ?? "" };
    return this.http.post<ILogoutReturn>(`${this.basePath}/logout`, body).pipe(
      tap((data: ILogoutReturn) => {
        this.accessToken = null;
        console.log("LOGOUT SUCCESSFUL");
      })
    );
  }

  createdb(): Observable<object> {
    console.log("CREATEDB");
    return this.http.get(`${this.basePath}/createdbdeleteme`);
  }
}
