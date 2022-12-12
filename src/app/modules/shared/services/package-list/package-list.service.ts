import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';
import { BaseService } from '../../../../core/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class PackageListService extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  getPackagesList() {
    const url = `${environment.apiUrls.baseUrl}v1/packages/packagelist`;
    return this.get(url);
  }

  filterPackageList(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/packages/packagelist`;
    return this.post(url, body);
  }

  sendNotificationStatus(data: any) {
    const url = `${environment.apiUrls.baseUrl}v1/updatedash/updatedashboard`;
    return this.post(url, data);
  }
}
