import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';
import { BaseService } from '../../../../core/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardListService extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  dashboardList(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/dashboardlist/dashboardlist`;
    return this.post(url, body);
  }

  dashboardInsert(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/adddetail/dashboardinsert`;
    return this.post(url, body);
  }

  dashboardUpdate(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/updatedash/updatedashboard`;
    return this.post(url, body);
  }

}
