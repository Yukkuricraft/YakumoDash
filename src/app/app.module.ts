import { AppComponent } from "@app/app.component";
import { AppRoutingModule } from "@app/app-routing.module";
import { AppState } from "@app/store/app.state";
import { AuthService } from "@app/services/auth/auth.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { ConfirmationDialogComponent } from "@app/components/shared/confirmation-dialog/confirmation-dialog.component";
import { ContainerActionsComponent } from "@app/components/shared/container-actions/container-actions.component";
import { ContainerStatusCardComponent } from "@app/components/shared/container-status-card/container-status-card.component";
import { ContainerStatusComponent } from "@app/components/shared/container-status/container-status.component";
import { ContainerStatusLightComponent } from "@app/components/shared/container-status-light/container-status-light.component";
import { ContentWithSideNavComponent } from "@app/layouts/content-with-side-nav/content-with-side-nav.component";
import { DashboardComponent } from "@app/components/dashboard/dashboard.component";
import { EffectsModule } from "@ngrx/effects";
import { Features } from "@app/store";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
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
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MinecraftContainersTableComponent } from "@app/components/environment-management/subcomponents/minecraft-containers-table/minecraft-containers-table.component";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { NewEnvironmentDialogComponent } from "@app/components/environment-management/subcomponents/new-environment-dialog/new-environment-dialog.component";
import { ServerConsoleDialogComponent } from "@app/components/shared/server-console-dialog/server-console-dialog.component";
import { NgModule, Type } from "@angular/core";
import { RootEffects } from "@app/store/root.effects";
import { rootReducer } from "@app/store/root.reducer";
import { EnvironmentManagementComponent } from "@app/components/environment-management/environment-management.component";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { TextEditorDialogComponent } from "@app/components/shared/text-editor-dialog/text-editor-dialog.component";
import { TokenInterceptor } from "@app/interceptors/token/token.interceptor";

import { config as socketioConfig } from "@app/services/socketio/socketio.service";
// import { NgTerminalModule } from "ng-terminal";
import { SocketIoModule } from "ngx-socket-io";

import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from "@abacritt/angularx-social-login";
import { ActionReducerMap, StoreModule } from "@ngrx/store";
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from "@angular/material/snack-bar";
import { ServerEditorComponent } from "@app/components/server-editor/server-editor.component";
import { NestedFileTreeComponent } from "./components/server-editor/subcomponents/nested-file-tree/nested-file-tree.component";
import { MatTreeModule } from "@angular/material/tree";

const reducers: ActionReducerMap<AppState> = {
  [Features.Root]: rootReducer,
};

const effects: Type<any>[] = [RootEffects];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContentWithSideNavComponent,
    DashboardComponent,
    EnvironmentManagementComponent,
    NewEnvironmentDialogComponent,
    ServerConsoleDialogComponent,
    MinecraftContainersTableComponent,
    ContainerActionsComponent,
    ContainerStatusLightComponent,
    ConfirmationDialogComponent,
    TextEditorDialogComponent,
    ContainerStatusComponent,
    ContainerStatusCardComponent,
    ServerEditorComponent,
    NestedFileTreeComponent,
  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({ maxAge: 50 }),
    EffectsModule.forRoot(effects),
    MonacoEditorModule.forRoot(),
    SocketIoModule.forRoot(socketioConfig),

    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    FormsModule,
    HttpClientModule,
    // NgTerminalModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ReactiveFormsModule,
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
              "1084736521175-2b5rrrpcs422qdc5458dhisdsj8auo0p.apps.googleusercontent.com",
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
