import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { AuthGuard } from "@app/guards/auth/auth.guard";
import { ContentWithSideNavComponent } from "@app/layouts/content-with-side-nav/content-with-side-nav.component";
import { DashboardComponent } from "@app/components/dashboard/dashboard.component";
import { ServerManagementComponent } from "@app/components/server-management/server-management.component";

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ContentWithSideNavComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'server-mgmt',
        component: ServerManagementComponent,
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
