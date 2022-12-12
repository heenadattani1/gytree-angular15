import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../../../../core/services/base/base.service';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThyrocareService extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  getTestsList(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/newoffer/thyrocare_new_offer`;
    return this.post(url, body);
  }

  verifyPincode(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/pinthyrocare/thyrocare_pincode`;
    return this.post(url, body);
  }

  getSlotAvailability(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/slotsthyrocare/thyrocare_slot_availablity`;
    return this.post(url, body);
  }

  booking(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/dsabookthyrocare/thyrocare_DSA_booking`;
    return this.post(url, body);
  }

  orderSummary(body: any) {
    const url = `${environment.apiUrls.baseUrl}v1/orderthyrocare/thyrocare_ordersummary`;
    return this.post(url, body);
  }

}
