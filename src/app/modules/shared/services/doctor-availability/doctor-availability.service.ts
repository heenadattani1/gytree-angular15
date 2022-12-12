import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BaseService } from '../../../../core/services/base/base.service';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorAvailabilityService extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  doctorAvailability(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/docslot/doctorslotlist`;
    return this.post(url, body);
  }
}
