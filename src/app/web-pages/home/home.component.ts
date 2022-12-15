import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

// Config and schema
import { CAROUSEL_CONFIG } from 'src/app/modules/shared/constants/carousel-config.constant';
import { BANNER_LIST_SCHEMA } from '../../modules/shared/models/banner-list.constant';
import { HOME_CONSTANT_CONFIG, SHAPING_GYTREE_LIST } from './home.constant';
import { OUR_TEAM_CONFIG } from '../our-team/our-team.constant';

// Common Utils
import { CommonUtil } from 'src/app/utils/common-util';

// Services
import { LoaderService } from '../../shared/services/loader.service';
import { NavigateService } from '../../modules/shared/helper-utils/navigate.service';
import { ArticlesListService } from '../../modules/shared/services/articles-list/articles-list.service';
import { BannerListService } from '../../modules/shared/services/banner-list/banner-list.service';
import { FaqListService } from '../../modules/shared/services/faq-list/faq-list.service';
import { HealthClinicListService } from '../../modules/shared/services/health-clinic-list/health-clinic-list.service';
import { PackageListService } from '../../modules/shared/services/package-list/package-list.service';
import { UserAgewiseListService } from '../../modules/shared/services/user-agewise-list/user-agewise-list.service';
import { VideosListService } from '../../modules/shared/services/videos-list/videos-list.service';
import { WhyUseGytreeService } from '../../modules/shared/services/why-use-gytree/why-use-gytree.service';
import { WhatWeTreatService } from '../../modules/shared/services/what-we-treat/what-we-treat.service';
import { StoreDataService } from 'src/app/shared/services/store-data.service';
import { GetDataService } from 'src/app/shared/services/get-data.service';
import { DoctorsListService } from 'src/app/modules/shared/services/doctors-list/doctors-list.service';
import { ThyrocareService } from 'src/app/modules/shared/services/thyrocare/thyrocare.service';
import { LabTestConfigService } from 'src/app/modules/shared/services/lab-test-config/lab-test-config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetaTagsService } from '../../modules/shared/services/meta-tags/meta-tags.service';
import { MetaTagsEnum } from '../../shared/constants/meta-tags.enum';
import { EventTrackingService } from '../../shared/services/event-tracking.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent
  extends StoreDataService
  implements OnInit, OnDestroy
{
  @ViewChild('block') block: ElementRef;
  @ViewChild('firstblock') firstblock: ElementRef;
  @ViewChild('secondblock') secondblock: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const popBannerElement: BANNER_LIST_SCHEMA = this.banners?.pop()!;
    this.banners = [...this.banners, popBannerElement];
    this.screenWidth();
  }
  lastScrollTop = 0;
  isDataVisible = {
    whatWeTreat: false,
    packages: false,
    whyGytree: false,
    shapingGytree: false,
    ageWiseFilter: false,
    healthClinic: false,
    articles: false,
    otherPackages: false,
    videos: false,
    faq: false,
  };
  @HostListener('window:scroll', ['$event'])
  onScroll(e: any) {
    let firstBlockData = this.firstblock?.nativeElement.getBoundingClientRect();
    let secondBlockData =
      this.secondblock?.nativeElement.getBoundingClientRect();
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.lastScrollTop) {
      if (
        firstBlockData &&
        firstBlockData.top < 700.359375 &&
        firstBlockData.top > 20 &&
        this.translateXRight >= -96
      ) {
        this.scrollFirstAnimationTopToBotttom();
      }
      if (
        secondBlockData &&
        secondBlockData.top < 800.359375 &&
        secondBlockData.top > 10 &&
        this.translateXLeft >= 0 &&
        this.translateXLeft <= 80
      ) {
        this.scrollSecondBlockAnimationTopToBottom();
      }
    } else {
      if (
        firstBlockData &&
        firstBlockData.bottom > 100.359375 &&
        firstBlockData.bottom < 1060.546875 &&
        this.translateXRight <= -10
      ) {
        this.scrollFirstAnimationBottomToTop();
      }
      if (
        secondBlockData &&
        secondBlockData.bottom > 100.359375 &&
        secondBlockData.bottom < 1060.546875 &&
        this.translateXLeft >= 40
      ) {
        this.scrollSecondAnimationBottomToTop();
      }
    }
    this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling

    this.allScrollEvents();
  }

  mobileScreen: boolean;
  offerList: OwlOptions;
  newOfferList: OwlOptions;
  consultationList: OwlOptions;
  articleList: OwlOptions;
  videoList: OwlOptions;
  whatWeTreatOwl = HOME_CONSTANT_CONFIG.whatWeTreatOwl;
  shapingGytree: OwlOptions = this.homeConstantConfig.shapingGytree;
  shapingGytreeTeam;
  CAROUSEL_CONFIG = CAROUSEL_CONFIG;
  OUR_TEAM_CONFIG = OUR_TEAM_CONFIG;
  homeConstantConfig = HOME_CONSTANT_CONFIG;
  isLoading: boolean;
  translateXLeft = 0;
  translateXRight = 0;
  subscriptions: Subscription[] = [];
  animationStylesRight: {};
  animationStylesLeft: {};

  constructor(
    public metaService: Meta,
    private titleService: Title,
    public cdr: ChangeDetectorRef,
    public modalService: NgbModal,
    public loaderService: LoaderService,
    public faqListService: FaqListService,
    private navigateService: NavigateService,
    public bannerListService: BannerListService,
    public videosListService: VideosListService,
    public whatWeTreatService: WhatWeTreatService,
    public packagesListService: PackageListService,
    public whyUseGytreeService: WhyUseGytreeService,
    public articlesListService: ArticlesListService,
    public agewiseListService: UserAgewiseListService,
    public healthClinicListService: HealthClinicListService,
    public doctorsListService: DoctorsListService,
    public thyrocareService: ThyrocareService,
    public labTestConfigService: LabTestConfigService,
    private metaTagsService: MetaTagsService,
    private eventTrackingService: EventTrackingService,
    public GetData: GetDataService
  ) {
    super(
      bannerListService,
      videosListService,
      whatWeTreatService,
      packagesListService,
      whyUseGytreeService,
      articlesListService,
      agewiseListService,
      healthClinicListService,
      faqListService,
      doctorsListService,
      thyrocareService,
      labTestConfigService,
      modalService,
      GetData,
      loaderService
    );

  }

  ngOnInit(): void {
    this.screenWidth();
    this.listsConfig();
    this.setMetaTagAndTitle();
    this.getBannerdata();
    // this.whatWeTreatScrollEvent();
  }

  getBannerdata() {
    this.GetData.storedBannerData.subscribe((res) => {
      if (res && res?.banners) {
        this.banners = res?.banners;
        // this.homeData = { ...this.homeData, banners: this.banners };
      }
      setTimeout(() => {
        if (!this.banners?.length) {
          this.bannerListService.getBannerList().subscribe((resp: any) => {
            this.banners = resp?.data;
            // this.homeData = { ...this.homeData, banners: this.banners };
            this.GetData.storedBannerData.next({ banners: resp?.data });
          });
        }
      }, 200);
    });
  }

  allScrollEvents() {
    this.whatWeTreatScrollEvent();
    this.packagesScrollEvent();
    this.whyGytreeScrollEvent();
    this.shapingGytreeScrollEvent();
    this.ageWiseScrollEvent();
    this.healthClinicsScrollEvent();
    this.otherPackagesScrollEvent();
    this.articlesScrollEvent();
    this.videosScrollEvent();
    this.faqScrollEvent();
  }

  getPackages() {
    this.packagesListService.getPackagesList().subscribe((res) => {
      if (res?.success) {
        this.packages = { ...this.packages, packageData: res?.data };
        const middle = Math.ceil(this.packages?.packageData?.length / 2);
        const first =
          (this.packages?.packageData || []) &&
          this.packages?.packageData?.slice(0, middle);
        const second = (this.packages?.packageData || [])?.slice(-middle);
        const allPackages = res?.data;
        this.packages = {
          ...this.packages,
          packageData: res?.data,
          first: first,
          second: second,
          allPackages: allPackages,
        };
        this.packagesData = { ...this.packagesData, packages: this.packages };
        this.GetData.storedOurPackagesData.next(this.packagesData);
        this.addFilterPackageData();
        this.packages.packageData = this.packages.allPackages;
        const pData: any = _.groupBy(
          this.packages?.packageData,
          'gtp_type_name'
        );
        this.packages = { ...this.packages, packageData: pData };
        this.packageType = Object.keys(this.packages.packageData);
        const startValue = 'Gynaecology';
        this.packageType.sort((x, y) => {
          return x === startValue ? -1 : y === startValue ? 1 : 0;
        });
        this.type = this.packageType[0];
      }
    });
  }

  packagesScrollEvent() {
    var offsets = document
      .getElementById('package-block')
      .getBoundingClientRect();
    var top = offsets.top;
    if (top < 1200 && !this.isDataVisible.packages) {
      this.GetData.storedOurPackagesData.subscribe((res) => {
        if (!res?.packages || res?.packages === null) {
          this.getPackages();
        } else {
          this.packages = res?.packages;
        }
      });
      this.isDataVisible.packages = true;
    }
  }

  otherPackagesScrollEvent() {
    var offsets = document
      .getElementById('other-package-block')
      .getBoundingClientRect();
    var top = offsets.top;
    if (top < 1200 && !this.isDataVisible.otherPackages) {
      this.GetData.storedOurPackagesData.subscribe((res) => {
        if (!res?.packages || res?.packages === null) {
          this.getPackages();
        } else {
          this.packages = res?.packages;
        }
      });
      this.isDataVisible.otherPackages = true;
    }
  }

  getWhatWeTreat() {
    this.whatWeTreatService.getWhatWeTreatList().subscribe((res) => {
      if (res?.success) {
        this.whatWeTreatList = res.data;
        const middleIndex = Math.ceil(res.data.length / 2);
        this.whatWeTreat = {
          ...this.whatWeTreat,
          whatWeTreatList: this.whatWeTreatList,
          first: res.data.slice(0, middleIndex),
        };
        this.whatWeTreat = {
          ...this.whatWeTreat,
          second: res.data.slice(-middleIndex),
        };
        this.whatWeTreatList = res.data;
        this.homeData = { ...this.homeData, whatWeTreat: this.whatWeTreat };
        this.GetData.storedHomeData.next(this.homeData);
      }
    });
  }

  whatWeTreatScrollEvent() {
    var offsets = document
      .getElementById('what-we-treat-block')
      .getBoundingClientRect();
    var top = offsets.top;
    if (top < 1200 && !this.isDataVisible.whatWeTreat) {
      this.GetData.storedHomeData.subscribe((res) => {
        if (!res?.whatWeTreat || res?.whatWeTreat === null) {
          this.getWhatWeTreat();
        } else {
          this.whatWeTreat = res?.whatWeTreat;
        }
      });
      this.isDataVisible.whatWeTreat = true;
    }
  }

  getWhyGytree() {
    this.whyUseGytreeService.getWhyUseGytreeList().subscribe((res) => {
      if (res?.success) {
        this.whyGytree = res.data;
        this.homeData = { ...this.homeData, whyGytree: this.whyGytree };
        this.GetData.storedHomeData.next(this.homeData);
      }
    });
  }

  whyGytreeScrollEvent() {
    var offsets = document
      .getElementById('why-gytree-block')
      .getBoundingClientRect();
    var top = offsets.top;
    if (top < 1200 && !this.isDataVisible.whyGytree) {
      this.GetData.storedHomeData.subscribe((res) => {
        if (!res?.whyGytree || res?.whyGytree === null) {
          this.getWhyGytree();
        } else {
          this.whyGytree = res?.whyGytree;
        }
      });
      this.isDataVisible.whyGytree = true;
    }
  }

  shapingGytreeScrollEvent() {
    var offsets = document
      .getElementById('shaping-gytree-block')
      .getBoundingClientRect();
    var top = offsets.top;
    if (top < 1200 && !this.isDataVisible.shapingGytree) {
      this.shapingGytreeTeam = SHAPING_GYTREE_LIST;
      this.isDataVisible.shapingGytree = true;
    }
  }

  getAgeWiseFilters() {
    this.agewiseListService.getUserAgewiseList().subscribe((res) => {
      if (res?.success) {
        this.ages = res.data;
        this.ages.sort((a: any, b: any) => {
          return a.gtag_guid - b.gtag_guid;
        });
        this.commonData = { ...this.commonData, ages: this.ages };
        this.GetData.storedData.next(this.commonData);
      }
    });
  }

  ageWiseScrollEvent() {
    var offsets = document
      .getElementById('age-wise-block')
      .getBoundingClientRect();
    var top = offsets.top;
    if (top < 1200 && !this.isDataVisible.ageWiseFilter) {
      this.GetData.storedData.subscribe((res) => {
        if (!res?.ages || res?.ages === null) {
          this.getAgeWiseFilters();
        } else {
          this.ages = res?.ages;
        }
      });
      this.isDataVisible.ageWiseFilter = true;
    }
  }

  gethealthClinics() {
    this.healthClinicListService.getHealthClinicList({}).subscribe((res) => {
      if (res?.success) {
        this.consults = res.data;
        this.commonData = { ...this.commonData, consults: this.consults };
        this.GetData.storedData.next(this.commonData);
      }
    });
  }

  healthClinicsScrollEvent() {
    var offsets = document
      .getElementById('health-clinic-block')
      .getBoundingClientRect();
    var top = offsets.top;
    if (top < 1200 && !this.isDataVisible.healthClinic) {
      this.GetData.storedData.subscribe((res) => {
        if (!res?.consults || res?.consults === null) {
          this.gethealthClinics();
        } else {
          this.consults = res?.consults;
        }
      });
      this.isDataVisible.healthClinic = true;
    }
  }

  getArticles() {
    this.articlesListService.getArticlesList().subscribe((res) => {
      if (res?.success) {
        this.articles = res.data;
        this.commonData = { ...this.commonData, articles: this.articles };
        this.GetData.storedData.next(this.commonData);
      }
    });
  }

  articlesScrollEvent() {
    var offsets = document
      .getElementById('article-block')
      .getBoundingClientRect();
    var top = offsets.top;
    if (top < 1200 && !this.isDataVisible.articles) {
      this.GetData.storedData.subscribe((res) => {
        if (!res?.articles || res?.articles === null) {
          this.getArticles();
        } else {
          this.articles = res?.articles;
        }
      });
      this.isDataVisible.articles = true;
    }
  }

  getVideos() {
    this.videosListService.getVideosList().subscribe((res) => {
      if (res?.success) {
        this.videos = res.data;
        this.homeData = { ...this.homeData, videos: this.videos };
        this.GetData.storedHomeData.next(this.homeData);
        this.setIframeBackGroundImage();
      }
    });
  }

  videosScrollEvent() {
    var offsets = document
      .getElementById('video-block')
      .getBoundingClientRect();
    var top = offsets.top;
    if (top < 1200 && !this.isDataVisible.videos) {
      this.GetData.storedHomeData.subscribe((res) => {
        if (!res?.videos || res?.videos === null) {
          this.getVideos();
        } else {
          this.videos = res?.videos;
        }
      });
      this.isDataVisible.videos = true;
    }
  }

  getFaq() {
    this.faqListService.getFaqList().subscribe((res) => {
      if (res?.success) {
        this.faq = res.data;
        this.homeData = { ...this.homeData, faq: this.faq };
        this.GetData.storedHomeData.next(this.homeData);
      }
    });
  }

  faqScrollEvent() {
    var offsets = document.getElementById('faq-block').getBoundingClientRect();
    var top = offsets.top;
    if (top < 1200 && !this.isDataVisible.faq) {
      this.GetData.storedHomeData.subscribe((res) => {
        if (!res?.faq || res?.faq === null) {
          this.getFaq();
        } else {
          this.faq = res?.faq;
        }
      });
      this.isDataVisible.faq = true;
    }
  }

  /**
   * Scrollable animation
   */
  scrollFirstAnimationBottomToTop() {
    let animationStyleRight = {};
    this.translateXRight = this.translateXRight + 1;
    animationStyleRight = {
      transform: `translateX(${this.translateXRight}px)`,
    };
    this.animationStylesRight = animationStyleRight;
  }

  scrollSecondAnimationBottomToTop() {
    this.translateXLeft = this.translateXLeft - 1;
    let animationStyleLeft = {};
    animationStyleLeft = {
      transform: `translateX(${''}${this.translateXLeft}px)`,
    };
    this.animationStylesLeft = animationStyleLeft;
  }

  scrollFirstAnimationTopToBotttom() {
    let animationStyleRight = {};
    this.translateXRight = this.translateXRight - 1;
    animationStyleRight = {
      transform: `translateX(${this.translateXRight}px)`,
    };
    this.animationStylesRight = animationStyleRight;
  }

  scrollSecondBlockAnimationTopToBottom() {
    let animationStyleLeft = {};
    this.translateXLeft = this.translateXLeft + 1;
    animationStyleLeft = {
      transform: `translateX(${''}${this.translateXLeft}px)`,
    };
    this.animationStylesLeft = animationStyleLeft;
  }

  /**
   * Method to get the screen size
   */
  screenWidth() {
    if (window.innerWidth <= 575) {
      this.mobileScreen = true;
    } else {
      this.mobileScreen = false;
    }
    this.cdr.detectChanges();
  }

  onToggleConsultConsultHealthClinic(consult: any) {
    consult.isOpen = !consult.isOpen;
  }

  /**
   * Method to get the screen size
   */
  viewAllPackage() {
    this.navigateService.navigation(['/packages']);
  }

  /**
   * Method to get Configuration of all the lists on home screen
   */
  listsConfig() {
    this.offerList = this.homeConstantConfig.offerList;
    this.newOfferList = this.homeConstantConfig.newOfferList;
    this.consultationList = this.homeConstantConfig.consultationList;
    this.articleList = this.homeConstantConfig.articleList;
    this.videoList = this.homeConstantConfig.videoList;
    this.shapingGytree = this.homeConstantConfig.shapingGytree;
    this.cdr.detectChanges();
  }

  /**
   * Click Handler for Age Group selection
   * @param age age group selection
   */
  ageGroupClickHandler(age: string) {
    this.navigateService.navigation(['/packages', 'age', age]);
  }

  /**
   * Click Handler for Health Clinic selection
   * @param clinic health clinic selection
   */
  healthClinicClickHandler(clinic: string) {
    this.navigateService.navigation(['/packages', 'health-clinic', clinic]);
  }

  /**
   * Click Handler for opening selected Article in new Tab
   * @param url article url
   */
  articleClickHandler(url: string) {
    window.open(url, '_blank');
  }

  /**
   * Click Handler for redirecting to Solving your issues Screen
   */
  whatWeTreatClickHandler() {
    this.navigateService.navigation(['what-we-treat']);
  }

  /**
   * Click Handler to redirect to FAQs page
   */
  viewAllFaq() {
    this.navigateService.navigation(['/faq']);
  }

  bannerClick(banner) {
    this.bannerRedirectClick(banner?.gtb_type);
    this.eventTrackingService.trackEvent(
      'Banner Learn more Clicked',
      banner?.gtbn_slug
    );
  }

  /**
   * redirect to selected type screen
   * @param type package/lab test/ consultation
   */
  bannerRedirectClick(type: string) {
    if (type === 'package') this.navigateService.navigation(['/packages']);
    if (type === 'lab_test') this.navigateService.navigation(['/lab-test']);
    if (type === 'consultation')
      this.navigateService.navigation(['/book-doctor']);
  }

  /**
   * Clear subscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // Meta tag and title
  setMetaTagAndTitle() {
    this.subscriptions.push(
      this.metaTagsService?.metaTags.subscribe((res) => {
        if (res) {
          let metaData = res.filter((ele) => {
            return ele.meta_type === MetaTagsEnum.HOME;
          });
          const data = {
            title: 'Gytree - Home',
            metaTitle: metaData[0]?.gmt_title,
            metaDescription: metaData[0]?.gmt_desc,
            metaKeyword: metaData[0]?.gmt_keywords,
            metaImage: metaData[0]?.gmt_image,
          };
          CommonUtil.setMetaTagAndTitle(
            this.titleService,
            this.metaService,
            data
          );
        }
      })
    );
  }
}
