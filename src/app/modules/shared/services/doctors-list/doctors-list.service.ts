import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';
import { BaseService } from '../../../../core/services/base/base.service';

@Injectable({
  providedIn: 'root',
})
export class DoctorsListService extends BaseService {
  constructor(httpClient: HttpClient, tokenStorage: TokenStorageService) {
    super(httpClient, tokenStorage);
  }

  getdoctors() {
    const url = `${environment.apiUrls.baseUrl}v1/doctor/doctorslist`;
    return this.get(url);
  }
}
