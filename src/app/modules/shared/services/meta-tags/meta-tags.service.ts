import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';
import { BaseService } from '../../../../core/services/base/base.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetaTagsService extends BaseService {

  metaTags: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  metaList() {
    const url = `${environment.apiUrls.baseUrl}v1/metatag/metaTagListing`;
    return this.get(url);
  }
}