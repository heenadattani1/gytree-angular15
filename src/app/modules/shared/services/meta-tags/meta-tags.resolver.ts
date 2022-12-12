import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { MetaTagsService } from './meta-tags.service';

@Injectable({
  providedIn: 'root'
})
export class MetaTagsResolver implements Resolve<any> {
  constructor(private metaTagsService: MetaTagsService) { }
  resolve() {
    return this.metaTagsService.metaList().subscribe(res => {
      if (res) {
        this.metaTagsService.metaTags.next(res.data);
      }
    });
  }
}
