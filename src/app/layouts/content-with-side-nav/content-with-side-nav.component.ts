import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { AuthService } from "@app/services/auth/auth.service";
import { Router } from "@angular/router";

@Component({
	selector: "app-content-with-side-nav",
	templateUrl: "./content-with-side-nav.component.html",
	styleUrls: ["./content-with-side-nav.component.scss"],
})
export class ContentWithSideNavComponent {
	@ViewChild("drawer") sideNav: MatDrawer | undefined;

	constructor(private ycAuth: AuthService, private router: Router) {}

	logout() {
		this.ycAuth.logout().subscribe(resp => {
			this.router.navigateByUrl("/login");
		});
	}

	closeSideNav() {
		this.sideNav?.close();
	}
}
