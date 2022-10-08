import { Component, OnInit } from "@angular/core";
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { AuthService } from "@app/services/auth/auth.service";
import { setLoggedInUser } from "@app/store/root.actions";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  constructor(
    private http: HttpClient,
    private socialAuthService: SocialAuthService,
    private ycAuthService: AuthService,
    private store: Store,
    private router: Router
  ) {}
}
