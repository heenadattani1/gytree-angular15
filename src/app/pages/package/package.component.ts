import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CAROUSEL_CONFIG } from 'src/app/modules/shared/constants/carousel-config.constant';
import { CONSULTATION_SCHEMA } from 'src/app/modules/shared/models/consultations.constant';
import { GlobalBaseComponent } from '../../modules/shared/base-component/global-base/global-base.component';
import { PACKAGE_WISE_ORDER_SCHEMA } from '../../modules/shared/models/package-wise-order-list.constant';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent extends GlobalBaseComponent implements OnInit, OnDestroy {

  showDesc: boolean = false;
  xxlScreen: boolean;
  mobileScreen: boolean;
  outerHeight: number;
  consultations: CONSULTATION_SCHEMA = {
    consultationList: {
      ...CAROUSEL_CONFIG.carouselOptions,
      loop: false,
      center: false,
      margin: 20,
      navSpeed: 700,
      navText: ['<', '>'],
      items: 1,
      mouseDrag: true,
      touchDrag: true,
      responsive: {
        0: {
          nav: true,
          dots: false,
        },
        400: {
          nav: true,
          dots: false,
        },
        740: {
          nav: true,
          dots: false,
        },
        1000: {
          nav: true,
          dots: false,
        },
        1240: {
          nav: true,
          dots: false,
        }
      }
    }
  };
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth();
  }


  ngOnInit(): void {
    if (this.router.getCurrentNavigation()?.extras?.state?.package) {
      this.packageScreenSelectedPackage = this.router.getCurrentNavigation()?.extras?.state?.package;
    }
    this.titleService.setTitle('Gytree - Package');
    this.screenWidth();
    this.allPackageApiCall();
  }

  /**
   * Method to get the screen size
   */
  screenWidth() {
    if (window.innerWidth >= 1400) {
      this.xxlScreen = true;
    } else {
      this.xxlScreen = false;
    }
    //mobile screen size is 575
    if (window.innerWidth <= 720) {
      this.mobileScreen = true;
    } else {
      this.mobileScreen = false;
    }
    this.outerHeight = window.outerHeight;
    this.cdr.detectChanges();
  }

  expandDesc() {
    this.showDesc = !this.showDesc;
  }

  /**
   * Click Handler to display package data in right side panel
   * @param selectedPackage contains data of selected package
   */
  viewMoreClickHandler(selectedPackage: PACKAGE_WISE_ORDER_SCHEMA) {
    this.packageScreenSelectedPackage = selectedPackage;
    this.cdr.detectChanges();
  }

  /**
   * Method to redirect to packages screen for viewing all Packages 
   */
  viewAllPackages() {
    this.navigateService.navigation(['packages']);
  }

  /**
  * Method to redirect
  */
  bookNowClickHandler(route: string) {
    this.navigateService.navigation([route]);
  }

  /**
   * Clear packagesubscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.packagesubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}

