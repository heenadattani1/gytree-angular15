import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  constructor(private router: Router) { }

  navigation(route: string[], options?: NavigationExtras) {
    this.router.navigate(route, options)
  }
}
