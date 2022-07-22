import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GoogleLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { Store } from "@ngrx/store";
import { sendMessageToMaster } from "@angular/compiler-cli/ngcc/src/execution/cluster/utils";
import { initializeApp, setLoggedInUser } from "@app/store/root.actions";
import { switchMap } from "rxjs";
import { AuthService } from "@app/services/auth/auth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'main';

  constructor(
    private router: Router,
    private store: Store,
    private ycAuthService: AuthService,
    private authService: SocialAuthService,
  ) { }

  ngOnInit() {
    // Attempt login on load, not guaranteed to work if auth is expired
    this.store.dispatch(initializeApp());

    this.authService.authState.pipe(
      switchMap((user) => {
        return this.ycAuthService.login({ id_token: user.idToken })
      })
    ).subscribe(
      (loginResp) => {
        if (this.router.url === '/login') {
          // Do we ever want this from a non-login url?
          this.router.navigateByUrl('/')
        }

        //this.store.dispatch(initializeApp());
      }
    )
  }
}
