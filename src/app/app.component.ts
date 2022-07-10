import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  GoogleLoginProvider = GoogleLoginProvider

  user: SocialUser | null;
  title = 'main';
  apiUrl = ':5001/api'

  constructor(private http: HttpClient, private authService: SocialAuthService ) {
    this.user = null;
    console.log(this.authService)
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
    });
  }

  signOut(): void {
    this.authService.signOut();
  }


  up() {
    console.log("Upping")
    this.http.get(`${this.apiUrl}/prod/up`).subscribe(data => console.log(data))
  }
}
