import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Store } from "@ngrx/store";
import { AuthService } from "@app/services/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private snackbar: MatSnackBar, private router: Router) {}

  addAuthHeader(request: HttpRequest<any>) {
    const accessToken = this.authService.accessToken;
    if (accessToken) {
      return request.clone({
        setHeaders: {
          Authorization: `YC-Token ${accessToken}`
        }
      })
    }
    return request
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authReq = this.addAuthHeader(request);

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error.status === 401 && !request.url.includes("login")) {
          this.snackbar.open("Could not authenticate you. Redirecting to Login Page")
          this.router.navigateByUrl('/login');
        }

        return throwError(error);
      })
    );
  }
}
