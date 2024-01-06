import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "@app/components/login/login.component";
import { AuthGuard } from "@app/guards/auth/auth.guard";
import { ContentWithSideNavComponent } from "@app/layouts/content-with-side-nav/content-with-side-nav.component";
import { DashboardComponent } from "@app/components/dashboard/dashboard.component";
import { EnvironmentManagementComponent } from "@app/components/environment-management/environment-management.component";
import { ServerEditorComponent } from "@app/components/server-editor/server-editor.component";
import { BackupManagementComponent } from "./components/backup-management/backup-management.component";

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: ContentWithSideNavComponent,
    children: [
      {
        path: "",
        component: DashboardComponent,
      },
      {
        path: "env-mgmt",
        component: EnvironmentManagementComponent,
      },
      {
        path: "backup-mgmt",
        component: BackupManagementComponent,
      },
      {
        path: "server-editor",
        component: ServerEditorComponent,
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
