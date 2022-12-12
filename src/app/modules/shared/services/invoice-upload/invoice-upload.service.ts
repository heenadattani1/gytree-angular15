import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BaseService } from '../../../../core/services/base/base.service';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceUploadService extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  uploadInvoice(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/sendinvoice/update_send_invoice_mail`;
    return this.post(url, body);
  }
}
