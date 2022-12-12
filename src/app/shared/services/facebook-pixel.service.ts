import { Injectable } from '@angular/core';
declare let fbq: any;

@Injectable({
  providedIn: 'root'
})
export class FacebookPixelService {

  constructor() { }

  trackFacebookPixel(event, value) {
    fbq('trackCustom', event, { custom_parameter: value });
  }
}
