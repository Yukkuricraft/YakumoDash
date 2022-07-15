import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AuthGuardDirective } from './directives/auth-guard.directive';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { ActionReducerMap, StoreModule } from "@ngrx/store";
import { AppState } from "@app/store/app.state";
import { rootReducer } from "@app/store/root.reducer";
import { Features } from "@app/store";
import { AuthService } from "@app/services/auth/auth.service";
import { TokenInterceptor } from "@app/interceptors/token/token.interceptor";


const reducers: ActionReducerMap<AppState> = {
  [Features.Root]: rootReducer
};


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingPageComponent,
    AuthGuardDirective,
  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    StoreModule.forRoot(reducers),
    AppRoutingModule,

    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1084736521175-2b5rrrpcs422qdc5458dhisdsj8auo0p.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
    {
      provide: AuthService,
      deps: [HttpClient],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
