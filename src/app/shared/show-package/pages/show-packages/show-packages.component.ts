import { ChangeDetectorRef, Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
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
  @Input() packageDataTemp: any;
  @Input() carouselOption: any;
  @Input() purchasedPackages: boolean;
  @Input() homeMobilePackages: any;
  mobileScreen = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.getScreenSize();
  }

  getScreenSize() {
    this.packageData = {};
    setTimeout(() => {
      this.packageData = { ...this.packageDataTemp };
      this.cdr.detectChanges();
    });
    if (window.innerWidth <= 575) {
      this.mobileScreen = true;
      this.cdr.detectChanges();
    } else {
      this.mobileScreen = false;
      this.cdr.detectChanges();
    }
  }

  constructor(
    private navigateService: NavigateService,
    private eventTrackingService: EventTrackingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getScreenSize();
    this.cdr.detectChanges();
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