import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppState } from '@app/store/app.state';
import { AuthService } from '@app/services/auth/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { ContainerActionsComponent } from '@app/components/server-management/subcomponents/container-actions/container-actions.component';
import { ContainerStatusCardComponent } from './components/shared/container-status-card/container-status-card.component';
import { ContainerStatusComponent } from './components/shared/container-status/container-status.component';
import { ContainerStatusLightComponent } from './components/shared/container-status-light/container-status-light.component';
import { ContentWithSideNavComponent } from './layouts/content-with-side-nav/content-with-side-nav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EffectsModule } from '@ngrx/effects';
import { Features } from '@app/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MinecraftContainersTableComponent } from './components/server-management/subcomponents/minecraft-containers-table/minecraft-containers-table.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { NewEnvironmentDialogComponent } from './components/server-management/subcomponents/new-environment-dialog/new-environment-dialog.component';
import { NgModule, Type } from '@angular/core';
import { RootEffects } from '@app/store/root.effects';
import { rootReducer } from '@app/store/root.reducer';
import { ServerManagementComponent } from './components/server-management/server-management.component';
import { SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TextEditorDialogComponent } from './components/shared/text-editor-dialog/text-editor-dialog.component';
import { TokenInterceptor } from '@app/interceptors/token/token.interceptor';




const reducers: ActionReducerMap<AppState> = {
  [Features.Root]: rootReducer
};

const effects: Type<any>[] = [RootEffects]

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    ContainerActionsComponent,
    ContainerStatusCardComponent,
    ContainerStatusComponent,
    ContainerStatusLightComponent,
    ContentWithSideNavComponent,
    DashboardComponent,
    LoginComponent,
    MinecraftContainersTableComponent,
    NewEnvironmentDialogComponent,
    ServerManagementComponent,
    TextEditorDialogComponent,
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
    FormsModule,
    FormsModule,
    HttpClientModule,
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
