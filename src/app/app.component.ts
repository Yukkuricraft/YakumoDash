import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GoogleLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { Store } from "@ngrx/store";
import { sendMessageToMaster } from "@angular/compiler-cli/ngcc/src/execution/cluster/utils";
import { setLoggedInUser } from "@app/store/root.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'main';

  constructor(private store: Store, private authService: SocialAuthService) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      console.log("AUTHSTATE SUBSCRIPTION", user);
      this.store.dispatch(setLoggedInUser({ user }))
    });
  }
}
