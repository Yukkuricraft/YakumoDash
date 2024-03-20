import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "@app/components/login/login.component";
import { AuthGuard } from "@app/guards/auth/auth.guard";
import { ContentWithSideNavComponent } from "@app/layouts/content-with-side-nav/content-with-side-nav.component";
import { EnvironmentManagementComponent } from "@app/components/environment-management/environment-management.component";
import { BackupManagementComponent } from "./components/backup-management/backup-management.component";

// TODO: https://adrianfaciu.dev/posts/angular-router-external-links/
const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: ContentWithSideNavComponent,
    children: [
      {
        path: "",
        component: EnvironmentManagementComponent,
      },
      {
        path: "backup-mgmt",
        component: BackupManagementComponent,
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
