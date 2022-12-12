import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BannerListService } from '../../modules/shared/services/banner-list/banner-list.service';
import { GetDataService } from '../../shared/services/get-data.service';

@Injectable({
  providedIn: 'root'
})
export class HomeApiResolver implements Resolve<any> {

  constructor(
    public bannerListService: BannerListService,
    public GetData: GetDataService) { }
  resolve() {
      if (window.location.pathname === '/home' || window.location.pathname === '/') {
        this.GetData.storedBannerData.subscribe(res => {
          if (res === null) {
            this.bannerListService.getBannerList().subscribe(res => {
              this.GetData.storedBannerData.next({ banners: res.data });
            })
          }
        })
      }
  }
}
