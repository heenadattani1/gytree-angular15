import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigateService } from 'src/app/modules/shared/helper-utils/navigate.service';
import { EventTrackingService } from '../../../services/event-tracking.service';

@Component({
  selector: 'app-show-packages',
  templateUrl: './show-packages.component.html',
  styleUrls: ['./show-packages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShowPackagesComponent implements OnInit {
  @Input() packageData: any;
  @Input() carouselOption: any;
  @Input() purchasedPackages: boolean;
  mobileScreen: boolean;
  packageDataTemp: any;

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    if (!this.mobileScreen) {
      this.packageData.packageData = [];
      setTimeout(() => {
        this.packageData.packageData = [...this.packageDataTemp];
      });
    }
  }

  constructor(
    private navigateService: NavigateService,
    private eventTrackingService: EventTrackingService,
  ) { }

  ngOnInit(): void {
    this.packageDataTemp = this.packageData?.packageData;
  }

  converToNumber(data: any) {
    return Number(data)
  }

  /**
   * Click Handler for redirecting to Package Details Screen
   * @param slug package slug
   */
  packageDetailsClick(slug: string) {
    this.navigateService.navigation(['/package-details', slug]);
  }

  /**
   * Click Handler for redirecting to My Packages Screen
   * @param package selected package data
   */
  viewMoreClickHandler(packageData: any) {
    this.navigateService.navigation(['/package'], { state: { package: packageData } });
  }

  /**
  * Method for redirecting to Schedule Screen 
  * @param slug package slug
  */
  buyNowClickHandler(slug: string) {
    this.navigateService.navigation(['/schedule-appointment', slug]);
    this.eventTrackingService.trackEvent('Book Now Clicked', 'Package_' + slug);
  }

}