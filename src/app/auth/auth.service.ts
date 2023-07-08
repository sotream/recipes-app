import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { Router } from "@angular/router";

import { User } from './user.model';

export interface AuthResponseData {
  data: {
    userId: number;
    email: string;
    token: string;
    expiresIn: number;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private logoutTimerId: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>('http://localhost:8080/api/auth/signup', {
        email,
        password
      })
      .pipe(
        catchError(this.handleError),
        tap(({ data }) => {
          this.handleAuthentication(data.userId, data.email, data.token, data.expiresIn)
        })
      )
  }

  signIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>('http://localhost:8080/api/auth/signin', {
        email,
        password
      })
      .pipe(
        catchError(this.handleError),
        tap(({ data }) => {
          this.handleAuthentication(data.userId, data.email, data.token, data.expiresIn)
        })
      )
  }

  autoLogin () {
    const userData: {
      userId: number;
      email: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.userId,
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate)
    )

    if (loadedUser.token) {
      this.user.next(loadedUser);

      const expirationDelta = new Date(userData._tokenExpirationDate).getTime() - Date.now();

      this.autoLogout(expirationDelta);
    }
  }

  logout() {
    this.user.next(null);

    localStorage.removeItem('userData');

    if (this.logoutTimerId) {
      clearTimeout(this.logoutTimerId)
    }

    this.logoutTimerId = null;

    this.router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number) {
    this.logoutTimerId = setTimeout(() => {
      this.logout();
    }, expirationDuration)
  }

  private handleAuthentication(userId: number, email: string, token: string, expiresIn: number) {
    const expirationDate = new Date(Date.now() + expiresIn * 1000);
    const user = new User(userId, email, token, expirationDate);

    this.user.next(user);
    this.autoLogout(expiresIn * 1000);

    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An error occurred!'

    if (!errorRes || !errorRes.error.data || !errorRes.error.data.error) {
      return throwError(errorMessage)
    }

    switch (errorRes.error.data.error.message) {
      case 'Validation error': {
        errorMessage = 'User already exists!';

        break;
      }
      default: {
        errorMessage = 'An error occurred!';
      }
    }

    return throwError(errorMessage)
  }
}
