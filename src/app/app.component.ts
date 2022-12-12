import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { LoaderService } from './shared/services/loader.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AnimationOptions } from 'ngx-lottie';

import { Subscription } from 'rxjs';
import { AuthService as authenticationService } from './modules/shared/services/auth/auth.service';

import { Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { GetDataService } from './shared/services/get-data.service';
import { NavigateService } from './modules/shared/helper-utils/navigate.service';
import { LocalStorageService } from './modules/shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("fadeIn", [
      state("in", style({ opacity: 1 })),
      transition(":enter", [style({ opacity: 0 }), animate(300)]),
      transition(":leave", animate(200, style({ opacity: 0 }))),
    ]),
  ],
})
export class AppComponent implements OnInit {

  subscriptions: Subscription[] = [];
  isShowSplash = false;
  loading = true;
  styles: Partial<any> = {
    'margin-right': '10px',
    'font-size': '20px',
    'height': '170px',
    'width': '170px'
  };
  options: AnimationOptions = {
    path: 'https://image.gytree.com/assets/ngx-lottie/loader.json',
  };
  isBrowser: boolean;
  timer = 4;

  constructor(
    public metaService: Meta,
    private router: Router,
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
    private navigateService: NavigateService,
    private localStorageService: LocalStorageService,
    private authenticationService: authenticationService,
    private GetData: GetDataService,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.localStorageService.setSplashScreen();
  }

  ngOnInit() {
    if (this.localStorageService.getItem('userSlug')) {
      this.validateUser();
    }
    this.checkL();
    window.addEventListener('load', () => {
      setInterval(() => {
        if (!this.timer) {
          this.GetData.trackEventData = true;
          this.allScripts();
        }
        this.timer -= 1;
      }, 1000)
    });

    this.hideLoader();
  }

  hideLoader() {
    setTimeout(() => {
      this.isShowSplash = true;
    }, 1000);
  }

  allScripts() {
    if (!document.getElementById('GTM')) {
      var script = document.createElement('script');
      script.id = 'GTM';
      script.src = "./assets/script/googleTagManager.js";
      script.async = true;
      document.body.appendChild(script);
    }
    if (!document.getElementById('FBPixel')) {
      var script = document.createElement('script');
      script.id = 'FBPixel';
      script.src = "./assets/script/facebookPixel.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }

  
  validateUser() {
    const payload = {
      user_slug: this.localStorageService.getItem('userSlug')?.user_slug,
      user_mob_no: this.localStorageService.getItem('userSlug')?.user_mobile_number
    }
    this.subscriptions.push(this.authenticationService.validateUserSlug(payload).subscribe((data: any) => {
      if (data?.success && !data?.data?.isexist) {
        this.localStorageService.removeItem('userSlug');
        this.navigateService.navigation(['/auth/login']);
      }
    }));
  }

  checkL() {
    this.loaderService.isLoading.subscribe((v) => {
      if (this.router.url === '/home' || this.router.url === '/') {
        this.loading = false;
      } else {
        this.loading = v;
      }
      this.cdr.detectChanges();
    });
  }

}
