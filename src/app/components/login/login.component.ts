import { Component, OnInit } from "@angular/core";
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { AuthService } from "@app/services/auth/auth.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  bypassGoogleAuth = !environment.USE_AUTH;

  constructor(
    private http: HttpClient,
    private socialAuthService: SocialAuthService,
    private ycAuthService: AuthService,
    private store: Store,
    private router: Router
  ) {}

  bypassToken = "bypass"
  bypassLogin() {
    this.ycAuthService.accessToken = this.bypassToken;
    this.ycAuthService.authSubject$.next({ idToken: 'YC-Token bypass' });
    this.ycAuthService.authSubject$.subscribe(console.log)
  }
}
