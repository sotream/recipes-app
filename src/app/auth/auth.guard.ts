import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

export function authGuard(): CanActivateFn {
  return () => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);

    return authService.user.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;

        if (isAuth) {
          return true;
        }

        return router.createUrlTree(['/auth'])
      }),
      // tap((isAuth) => {
      //   if (!isAuth) {
      //     router.navigate(['/auth'])
      //   }
      // })
    );
  };
}
