import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../../../../core/services/base/base.service';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class BillingDetailsService extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  getBillingFormDetails(data: any) {
    const url = `${environment.apiUrls.baseUrl}v1/bilingdata/billingdetail`;
    return this.post(url, data);
  }

  sendBillingDetails(data: any) {
    const url = `${environment.apiUrls.baseUrl}v1/billing/billingdetail`;
    return this.post(url, data);
  }

}
