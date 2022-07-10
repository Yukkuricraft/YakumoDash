import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GoogleLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'main';
}
