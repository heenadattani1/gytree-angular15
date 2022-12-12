import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../../../../core/services/base/base.service';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  generateOtp(payload: any) {
    const url = `${environment.apiUrls.baseUrl}v1/myotp/generatePin`;
    return this.post(url, payload);
  }

  validateUser(payload: any) {
    const url = `${environment.apiUrls.baseUrl}v1/otpvalidate/validatelogin`
    return this.httpClient.post(url, payload);
  }

  registerUser(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/register/registeruser`;
    return this.post(url, body);
  }

  validateUserSlug(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/validate/validateuser`;
    return this.post(url, body);
  }

}
