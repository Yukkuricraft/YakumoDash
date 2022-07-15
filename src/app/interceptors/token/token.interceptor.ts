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

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  addAuthHeader(request: HttpRequest<any>) {
    const accessToken = this.authService.accessToken;
    console.log("Grabbing access token?", accessToken)
    if (accessToken) {
      return request.clone({
        setHeaders: {
          Authorization: accessToken
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
          window.location.href = '/login';
        }

        return throwError(error);
      })
    );
  }
}
