import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { Store } from "@ngrx/store";
import { AuthService } from "@app/services/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { RootActions } from "@app/store/root/root.actions";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private store: Store
  ) {}

  addAuthHeader(request: HttpRequest<any>) {
    const accessToken = this.authService.accessToken;
    if (accessToken) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    return request;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authReq = this.addAuthHeader(request);

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error.status === 401 && !request.url.includes("login")) {
          this.snackbar.open(
            "Could not authenticate you. Redirecting to Login Page",
            "Ok"
          );
          this.store.dispatch(RootActions.beginForceNavigateToLogin());
        }

        return throwError(error);
      })
    );
  }
}
