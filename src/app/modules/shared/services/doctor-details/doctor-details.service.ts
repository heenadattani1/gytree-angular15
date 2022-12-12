import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../../../../core/services/base/base.service';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorDetialsService extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  getDoctorDetialsById(slug: any) {
    const url = `${environment.apiUrls.baseUrl}v1/doctorid/getdocbyid?gtd_slug=${slug}`;
    return this.get(url);
  }
}
