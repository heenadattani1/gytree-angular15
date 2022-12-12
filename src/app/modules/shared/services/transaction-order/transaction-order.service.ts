import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';
import { BaseService } from '../../../../core/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionOrderService extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  transactionInit(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/transactioninitialize/transactionInit`;
    return this.post(url, body);
  }

  transactionUpdate(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/trnupdate/transactionupdate`;
    return this.post(url, body);
  }

  dummyTransactionUpdate(body: any) {
    const url = `https://api.gytree.com/v1/dummytransactionupdate/dummytransactionupdate`;
    return this.post(url, body);
  }
}
