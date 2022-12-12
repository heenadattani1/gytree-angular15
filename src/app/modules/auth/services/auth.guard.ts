import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state.url === '/billing')
      state.url = '/lab-test';
    if (state.url.includes('consult') && !(state.url.includes('expert-consult')))
      state.url = '/our-experts';
    localStorage.setItem('URL', JSON.stringify(state.url));
    const currentUser = localStorage.getItem('userSlug');
    if (currentUser) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }
}
