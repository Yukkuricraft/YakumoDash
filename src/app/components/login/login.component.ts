import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { AuthService } from "@app/services/auth/auth.service";
import { setLoggedInUser } from "@app/store/root.actions";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: SocialUser | null;

  constructor(
      private http: HttpClient,
      private socialAuthService: SocialAuthService,
      private ycAuthService: AuthService,
      private store: Store,
      private router: Router,
  ) {
    this.user = null;
  }

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.store.dispatch(setLoggedInUser({ user }));
      this.ycAuthService.login({ id_token: user.idToken }).subscribe(
        (result) => {
          this.router.navigateByUrl('/');
        }
      )
    });
  }

  createdb() {
    this.ycAuthService.createdb().subscribe((data) => {
      console.log(data);
    });
  }
}
