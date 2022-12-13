import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, Scroll } from '@angular/router';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavigateService } from '../../modules/shared/helper-utils/navigate.service';
import { LocalStorageService } from '../../modules/shared/services/local-storage/local-storage.service';
import { EventTrackingService } from '../../shared/services/event-tracking.service';
import { NAV_ITEMS } from './web-layout.constant';

@Component({
  selector: 'app-web-layout',
  templateUrl: './web-layout.component.html',
  styleUrls: ['./web-layout.component.scss'],
})
export class WebLayoutComponent implements OnInit, OnDestroy {
  addClass = false;
  NAV_ITEMS = NAV_ITEMS;
  smallScreen: boolean;
  isHomeActive: boolean = false;
  isDisplayBookNow: boolean = true;
  userDetails = this.localStorageService.getItem('userSlug');
  isFooterVisible = false;

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.handleOverflowHidden();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(e: any) {
    this.footerScrollEvent();
  }

  constructor(
    private navigateService: NavigateService,
    private _eref: ElementRef,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private eventTrackingService: EventTrackingService
  ) {
    router.events.subscribe((val) => {
      if (
        val instanceof NavigationEnd &&
        (val?.url === '/' || val?.url === '/home')
      ) {
        this.isHomeActive = true;
      } 
      else if(val instanceof Scroll && (val?.routerEvent?.url === '/' || val?.routerEvent?.url === '/home') ){
        this.isHomeActive = true;
      }
      else {
        this.isHomeActive = false;
      }

      if (val instanceof NavigationEnd && val?.url === '/packages') {
        this.isDisplayBookNow = false;
      } else {
        this.isDisplayBookNow = true;
      }
    });
  }

  ngOnInit(): void {
    this.screenWidth();
    this.footerScrollEvent();
  }

  footerScrollEvent() {
    var offsets = document
      .getElementById('footer-block')
      .getBoundingClientRect();
    var top = offsets.top;
    if (top < 1200 && !this.isFooterVisible) {
      this.isFooterVisible = true;
    }
  }

  /**
   * Method to get the screen size
   */
  screenWidth() {
    if (window.innerWidth <= 991) {
      this.smallScreen = true;
    } else {
      this.smallScreen = false;
    }
    this.cdr.detectChanges();
  }

  /**
   *Click Handler of Book Now button
   */
  bookNowBtn() {
    this.addClass = false;
    this.removeOverFlowHiddenClassToBody();
    this.navigateService.navigation(['packages']);
  }

  addOverFlowHiddenClassToBody = () => {
    document.body.classList.add('overflow-hidden');
  };

  removeOverFlowHiddenClassToBody = () => {
    document.body.classList.remove('overflow-hidden');
  };

  handleOverflowHidden = () => {
    if (this.addClass && window.innerWidth <= 991) {
      this.addOverFlowHiddenClassToBody();
    } else {
      this.removeOverFlowHiddenClassToBody();
    }
  };

  onClickFooter(routerLink: string) {
    this.router.navigate([routerLink]);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }

  toggleAddClassVar(isSideBar: any) {
    if (isSideBar == 'IS_SIDE_BAR_OPEN') {
      this.addClass = !this.addClass;
    }
    this.handleOverflowHidden();
  }

  /**
   * close the menu bar on select of options for mobile screen
   */
  closeMenu(iconUser?: string, isSideBar: any = null) {
    this.toggleAddClassVar(isSideBar);
    if (iconUser) {
      this.navigateService.navigation(['/dashboard']);
    }
  }

  eventTracking(event, value) {
    this.eventTrackingService.trackEvent(event, value);
  }

  ngOnDestroy(): void {
    this.handleOverflowHidden();
  }
}
