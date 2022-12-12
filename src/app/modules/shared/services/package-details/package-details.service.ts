import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';
import { BaseService } from '../../../../core/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class PackageDetailsService extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  getPackageDetailsById(slug: any) {
    const url = `${environment.apiUrls.baseUrl}v1/packid/getpackageid?gtp_slug=${slug}`;
    return this.get(url);
  }
}
