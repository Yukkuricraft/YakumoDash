import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { AuthService } from "@app/services/auth/auth.service";
import { setLoggedInUser } from "@app/store/root.actions";
import { DockerService } from "@app/services/docker/docker.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: SocialUser | null;
  apiUrl = ':5001/api'

  constructor(
      private http: HttpClient,
      private socialAuthService: SocialAuthService,
      private ycAuthService: AuthService,
      private dockerService: DockerService,
      private store: Store
  ) {
    this.user = null;
    console.log(this.socialAuthService)
  }

  listContainers() {
    this.dockerService.list().subscribe(
      result => {
        console.log(result)
      }
    )
  }

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.store.dispatch(setLoggedInUser({ user }));
      this.ycAuthService.login({ id_token: user.idToken }).subscribe(
        (result) => {
          console.log("RETURN FROM LOGIN", result)
        }
      )
    });
  }
}
