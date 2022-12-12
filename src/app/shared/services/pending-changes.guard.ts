import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GetDataService } from './get-data.service';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor(private GetData: GetDataService) { }

  canDeactivate(
    component: ComponentCanDeactivate): Observable<boolean> | boolean {
    if (this.GetData.paymentCompleted) {
      return true;
    }
    else {
      history.pushState(null, null, location.href);
      window.onpopstate = function () {
        history.go(1);
      };
      return confirm('ALERT: Changes that you made may not be saved.');
    }
  }

}
