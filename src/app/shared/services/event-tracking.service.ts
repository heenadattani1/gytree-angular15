import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FacebookPixelService } from './facebook-pixel.service';
import { GetDataService } from './get-data.service';
@Injectable({
  providedIn: 'root'
})
export class EventTrackingService {

  constructor(
    private facebookPixelService: FacebookPixelService,
    private GetData: GetDataService,
  ) { }

  trackEvent(event, value) {
    if (environment.isEventTrackingEnabled && this.GetData.trackEventData) {
      this.facebookPixelService.trackFacebookPixel(event, value);
      if (environment.isConsoleLogEnabled) {
        console.log('event:', event);
        console.log('value:', value);
      }
    }
  }
}
