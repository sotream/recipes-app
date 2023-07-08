import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { exhaustMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          if (!user) {
            return next.handle(req)
          }

          const modifiedRequest = req.clone({
            headers: req.headers.set('authentication', `Bearer ${user.token}`)
          });

          return next.handle(modifiedRequest);
        })
      )
  }

}
