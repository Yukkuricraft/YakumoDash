import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { map, Observable, of } from "rxjs";
import { Store } from "@ngrx/store";
import { selectUser } from "@app/store/root.selectors";
import { AuthService } from "@app/services/auth/auth.service";
import { SocialUser } from "@abacritt/angularx-social-login";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.me().pipe(
      map(data => {
        console.log("I AM:", data);

        if (data === null) {
          this.router.navigateByUrl("/login");
        }

        return data !== null;
      })
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }
}
