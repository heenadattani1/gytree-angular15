import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';
import { BaseService } from '../../../../core/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorSlotAvailabilityService extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  doctorSlotAvailability(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/packdocslot/packagewisedocslot`;
    return this.post(url, body);
  }


  dummyDoctorSlotAvailability(body: any) {
    const url = `https://api.gytree.com/v1/dummypackdocslot/dummypackagewisedocslots`;
    return this.post(url, body);
  }
}
