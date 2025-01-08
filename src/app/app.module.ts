import { ActionReducerMap, StoreModule } from "@ngrx/store";
import { AppComponent } from "@app/app.component";
import { AppRoutingModule } from "@app/app-routing.module";
import { AppState } from "@app/store/app.state";
import { AuthService } from "@app/services/auth/auth.service";
import { BackupsManagementDialogComponent } from "./components/backup-management/backup-management.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { ConfirmationDialogComponent } from "@app/components/shared/confirmation-dialog/confirmation-dialog.component";
import { ContainerActionsComponent } from "@app/components/shared/container-actions/container-actions.component";
import { ContainerStatusCardComponent } from "@app/components/shared/container-status-card/container-status-card.component";
import { ContainerStatusComponent } from "@app/components/shared/container-status/container-status.component";
import { ContainerStatusLightComponent } from "@app/components/shared/container-status-light/container-status-light.component";
import { WorldsSelectorComponent } from "@app/components/shared/worlds-selector/worlds-selector.component";
import { ContentWithSideNavComponent } from "@app/layouts/content-with-side-nav/content-with-side-nav.component";
import { DateToShorthandPipe } from "@app/pipes/date-to-shorthand/date-to-shorthand.pipe";
import { EffectsModule } from "@ngrx/effects";
import { EnvironmentManagementComponent } from "@app/components/environment-management/environment-management.component";
import { Features } from "@app/store";
import { FilesService } from "@app/services/files/files.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleLoginProvider, GoogleSigninButtonModule } from "@abacritt/angularx-social-login";
import { LoginComponent } from "@app/components/login/login.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { MinecraftContainersTableComponent } from "@app/components/environment-management/subcomponents/minecraft-containers-table/minecraft-containers-table.component";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { NewEnvironmentDialogComponent } from "@app/components/environment-management/subcomponents/new-environment-dialog/new-environment-dialog.component";
import { NgModule, Type } from "@angular/core";
import { RootEffects } from "@app/store/root/root.effects";
import { ServerConsoleDialogComponent } from "@app/components/shared/server-console-dialog/server-console-dialog.component";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { TextEditorDialogComponent } from "@app/components/shared/text-editor-dialog/text-editor-dialog.component";
import { TokenInterceptor } from "@app/interceptors/token/token.interceptor";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

import { LetDirective } from "@ngrx/component";

import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from "@abacritt/angularx-social-login";
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from "@angular/material/snack-bar";
import { CapitalizePipe } from '@app/pipes/capitalize/capitalize.pipe';
import { AppStoreModule } from "@app/store/app-store.module";
import { environment } from "src/environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContentWithSideNavComponent,
    BackupsManagementDialogComponent,
    EnvironmentManagementComponent,
    NewEnvironmentDialogComponent,
    ServerConsoleDialogComponent,
    MinecraftContainersTableComponent,
    ContainerActionsComponent,
    ContainerStatusLightComponent,
    WorldsSelectorComponent,
    ConfirmationDialogComponent,
    TextEditorDialogComponent,
    ContainerStatusComponent,
    ContainerStatusCardComponent,
    DateToShorthandPipe,
    CapitalizePipe,
  ],
  imports: [
    AppStoreModule,
    BrowserModule,
    SocialLoginModule,
    MonacoEditorModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    FormsModule,
    HttpClientModule,
    // NgTerminalModule,
    LetDirective,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    ReactiveFormsModule,
    GoogleSigninButtonModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 5000, data: { action: "Close" } },
    },
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.G_OAUTH2_CLIENT_ID,
              {
                oneTapEnabled: false,
              }
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    {
      provide: AuthService,
      deps: [HttpClient],
    },
    {
      provide: FilesService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
