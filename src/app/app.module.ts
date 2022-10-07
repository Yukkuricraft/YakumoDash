import { NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { LoginComponent } from './components/login/login.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { ActionReducer, ActionReducerMap, MetaReducer, StoreModule } from "@ngrx/store";
import { AppState } from "@app/store/app.state";
import { rootReducer } from "@app/store/root.reducer";
import { Features } from "@app/store";
import { AuthService } from "@app/services/auth/auth.service";
import { TokenInterceptor } from "@app/interceptors/token/token.interceptor";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { ContentWithSideNavComponent } from './layouts/content-with-side-nav/content-with-side-nav.component';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ServerManagementComponent } from './components/server-management/server-management.component';
import { ContainerActionsComponent } from "@app/components/server-management/subcomponents/container-actions/container-actions.component";
import { MatButtonModule } from "@angular/material/button";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { EffectsModule } from "@ngrx/effects";
import { RootEffects } from "@app/store/root.effects";
import { localStorageSync } from 'ngrx-store-localstorage';
import { NewEnvironmentDialogComponent } from './components/server-management/subcomponents/new-environment-dialog/new-environment-dialog.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AuxContainerCardComponent } from './components/server-management/subcomponents/aux-container-card/aux-container-card.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MinecraftContainersTableComponent } from './components/server-management/subcomponents/minecraft-containers-table/minecraft-containers-table.component';
import { MatTableModule } from "@angular/material/table";
import { ContainerStatusLightComponent } from './components/shared/container-status-light/container-status-light.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TextEditorDialogComponent } from './components/shared/text-editor-dialog/text-editor-dialog.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ContainerStatusComponent } from './components/shared/container-status/container-status.component';


const reducers: ActionReducerMap<AppState> = {
  [Features.Root]: rootReducer
};

const effects: Type<any>[] = [RootEffects]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContentWithSideNavComponent,
    DashboardComponent,
    ServerManagementComponent,
    NewEnvironmentDialogComponent,
    AuxContainerCardComponent,
    MinecraftContainersTableComponent,
    ContainerActionsComponent,
    ContainerStatusLightComponent,
    ConfirmationDialogComponent,
    TextEditorDialogComponent,
    ContainerStatusComponent,
  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({ maxAge: 50 }),
    EffectsModule.forRoot(effects),
    MonacoEditorModule.forRoot(),

    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatDialogModule,
    MatCardModule,
    MatSidenavModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
    MatTooltipModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 5000, data: { action: 'Close' } },
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1084736521175-2b5rrrpcs422qdc5458dhisdsj8auo0p.apps.googleusercontent.com', {
                oneTapEnabled: false,
              }
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
