import { Injectable, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { CAROUSEL_CONFIG } from 'src/app/modules/shared/constants/carousel-config.constant';
import { ModalBaseClass } from 'src/app/modules/shared/modals/base_class/modal-base-class';
import { AGE_LIST_SCHEMA } from 'src/app/modules/shared/models/age-list.constant';
import { BANNER_LIST_SCHEMA } from 'src/app/modules/shared/models/banner-list.constant';
import { DOCTOR_DETAILS_SCHEMA } from 'src/app/modules/shared/models/doctor-details.constant';
import { FAQ_LIST_SCHEMA } from 'src/app/modules/shared/models/faq-list.constant';
import { HEALTH_CLINIC_LIST_SCHEMA } from 'src/app/modules/shared/models/health-clinic-list.constant';
import { LAB_TEST_CONFIG_SCHEMA } from 'src/app/modules/shared/models/lab-test.constant';
import { PACKAGE_SCHEMA1 } from 'src/app/modules/shared/models/package-list.constant';
import { VIDEOS_LIST_SCHEMA } from 'src/app/modules/shared/models/videos-list.constant';
import { WHY_USE_GYTREE_SCHEMA } from 'src/app/modules/shared/models/why-use-gytree.constant';
import { ArticlesListService } from 'src/app/modules/shared/services/articles-list/articles-list.service';
import { BannerListService } from 'src/app/modules/shared/services/banner-list/banner-list.service';
import { DoctorsListService } from 'src/app/modules/shared/services/doctors-list/doctors-list.service';
import { FaqListService } from 'src/app/modules/shared/services/faq-list/faq-list.service';
import { HealthClinicListService } from 'src/app/modules/shared/services/health-clinic-list/health-clinic-list.service';
import { LabTestConfigService } from 'src/app/modules/shared/services/lab-test-config/lab-test-config.service';
import { PackageListService } from 'src/app/modules/shared/services/package-list/package-list.service';
import { ThyrocareService } from 'src/app/modules/shared/services/thyrocare/thyrocare.service';
import { UserAgewiseListService } from 'src/app/modules/shared/services/user-agewise-list/user-agewise-list.service';
import { VideosListService } from 'src/app/modules/shared/services/videos-list/videos-list.service';
import { WhatWeTreatService } from 'src/app/modules/shared/services/what-we-treat/what-we-treat.service';
import { WhyUseGytreeService } from 'src/app/modules/shared/services/why-use-gytree/why-use-gytree.service';
import { HOME_CONSTANT_CONFIG } from 'src/app/web-pages/home/home.constant';
import { OUR_TEAM_CONFIG } from '../../web-pages/our-team/our-team.constant';
import { GetDataService } from './get-data.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class StoreDataService extends ModalBaseClass implements OnDestroy {

  subscriptions: Subscription[] = [];
  banners: any;
  packages: PACKAGE_SCHEMA1 = {
    packageData: [],
    carouselOptions: CAROUSEL_CONFIG.carouselOptions
  }
  articles: any;
  faq: FAQ_LIST_SCHEMA[];
  ages: AGE_LIST_SCHEMA[];
  consults: HEALTH_CLINIC_LIST_SCHEMA[];
  whyGytree: WHY_USE_GYTREE_SCHEMA[];
  videos: VIDEOS_LIST_SCHEMA[];
  whatWeTreat: any;
  whatWeTreatList: any;
  doctorType: string[];
  doctorsList: DOCTOR_DETAILS_SCHEMA | any;
  testList: any;
  testConfig: LAB_TEST_CONFIG_SCHEMA[];
  packageType: string[];
  type: string;
  isLoading: boolean = true;

  offerList: OwlOptions;
  newOfferList: OwlOptions;
  consultationList: OwlOptions;
  articleList: OwlOptions;
  videoList: OwlOptions;
  listOptions: OwlOptions;
  withOutNavBarOption: OwlOptions;
  homeConstantConfig = HOME_CONSTANT_CONFIG;

  homeData = {};
  commonData = {};
  expertData = {};
  labTestData = {};
  packagesData: any = {};


  constructor(
    public bannerListService: BannerListService,
    public videosListService: VideosListService,
    public whatWeTreatService: WhatWeTreatService,
    public packagesListService: PackageListService,
    public whyUseGytreeService: WhyUseGytreeService,
    public articlesListService: ArticlesListService,
    public agewiseListService: UserAgewiseListService,
    public healthClinicListService: HealthClinicListService,
    public faqListService: FaqListService,
    public doctorsListService: DoctorsListService,
    public thyrocareService: ThyrocareService,
    public labTestConfigService: LabTestConfigService,
    public modalService: NgbModal,
    public GetData: GetDataService,
    public loaderService: LoaderService,
  ) {
    super(modalService);
  }

  /**
   * Method to handle isLoading
   */
  checkIsLoading() {
    this.loaderService.isLoading.subscribe(res => {
      this.isLoading = res;
    });
  }

  commonApicall() {
    this.GetData.storedData.subscribe(res => {
      if (res === null) {
        this.getAgewiseList();
        this.getHealthClinicsList();
        this.getArticlesList();
      }
      else {
        this.ages = res?.ages;
        this.consults = res?.consults;
        this.articles = res?.articles;
        this.listsConfig();
      }
    });
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
    this.listOptions = OUR_TEAM_CONFIG.listOptions;
    this.withOutNavBarOption = OUR_TEAM_CONFIG.without_nav_option;
  }

  getPackagesApicall(filterType?, filter?) {
    this.GetData.storedOurPackagesData.subscribe(res => {
      if (res === null) {
        this.getPackagesList(filterType, filter);
      } else {
        this.packages = res?.packages;
      }
    })
  }

  /**
   * Method to get the Packages list from api 
   */
  getPackagesList(filterType, filter) {
    this.packagesListService.getPackagesList().subscribe(res => {
      if (res?.success) {
        this.packages = { ...this.packages, packageData: res?.data }
        const middle = Math.ceil(this.packages?.packageData?.length / 2);
        const first = (this.packages?.packageData || []) && this.packages?.packageData?.slice(0, middle);
        const second = (this.packages?.packageData || [])?.slice(-middle);
        const allPackages = res?.data;
        this.packages = { ...this.packages, packageData: res?.data, first: first, second: second, allPackages: allPackages }
        this.packagesData = { ...this.packagesData, packages: this.packages };
        this.GetData.storedOurPackagesData.next(this.packagesData);
        this.addFilterPackageData();
        if (filter) this.packages.packageData = this.packages[filter];
        else this.packages.packageData = this.packages.allPackages;
        const pData: any = _.groupBy(this.packages?.packageData, 'gtp_type_name');
        this.packages = { ...this.packages, packageData: pData }
        this.packageType = Object.keys(this.packages.packageData);
        const startValue = "Gynaecology";
        this.packageType.sort((x, y) => { return x === startValue ? -1 : y === startValue ? 1 : 0; });
        this.type = this.packageType[0];
      }
    })
  }

  addFilterPackageData() {
    const ageWiseArray: any = ['18-25', '25-38', '38+'];
    ageWiseArray?.forEach(data => {
      this.packagesData = { ...this.packagesData, packages: { ...this.packages, [data]: this.packages?.packageData?.filter(packageData => packageData?.gtp_agegroup?.includes(data)) } }
      this.packages = this.packagesData.packages;
      this.GetData.storedOurPackagesData.next(this.packagesData);
    });
    const healthClinicWiseArray: any = ['Sexual Health', 'Reproductive Health', 'Counselling/Therapy', 'General Wellbeing', 'Menstrual Health', 'Skin and Hair Care'];
    healthClinicWiseArray?.forEach(data => {
      this.packagesData = { ...this.packagesData, packages: { ...this.packages, [data]: this.packages?.packageData?.filter(packageData => packageData?.gtp_hcnctg?.includes(data)) } }
      this.packages = this.packagesData.packages;
      this.GetData.storedOurPackagesData.next(this.packagesData);
    });
  }

  /**
   * Method to get the User Agewise list from api 
   */
  getAgewiseList() {
    this.agewiseListService.getUserAgewiseList().subscribe(res => {
      if (res?.success) {
        this.ages = res.data;
        this.ages.sort((a: any, b: any) => {
          return a.gtag_guid - b.gtag_guid;
        })
        this.commonData = { ...this.commonData, ages: this.ages };
        this.GetData.storedData.next(this.commonData);
      }
    })
  }

  /**
   * Method to get the Health Clinics list from api 
   */
  getHealthClinicsList() {
    let payload = {};
    this.healthClinicListService.getHealthClinicList(payload).subscribe(res => {
      if (res?.success) {
        this.consults = res.data;
        this.commonData = { ...this.commonData, consults: this.consults };
        this.GetData.storedData.next(this.commonData);
      }
    })
  }

  /**
   * Method to get the Articles list from api 
   */
  getArticlesList() {
    this.articlesListService.getArticlesList().subscribe(res => {
      if (res?.success) {
        this.articles = res.data;
        this.commonData = { ...this.commonData, articles: this.articles };
        this.GetData.storedData.next(this.commonData);
      }
    })
  }

  setIframeBackGroundImage() {
    (this.videos || []).forEach((res, i) => {
      const data = `<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,
      span{position:absolute;width:100%;top:0;bottom:0;margin:auto}
      span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=${res?.gtv_url}>` + `<img src=https://img.youtube.com/vi/Y8Wp3dafaMQ/hqdefault.jpg><span>▶</span></a>`
      res.srcDoc = data;
    })
  }

  BookAnExpertApicall() {
    this.GetData.storedBookExpertData.subscribe(res => {
      if (res === null) {
        this.getDoctorsList();
      } else {
        this.doctorsList = res?.doctorsList;
        this.doctorType = res?.doctorType;
      }
    })
  }

  /**
   * Method to get the User Agewise list from api 
   */
  getDoctorsList() {
    this.doctorsListService.getdoctors().subscribe(res => {
      if (res?.success) {
        this.doctorsList = res.data;
        this.doctorType = Object.keys(this.doctorsList);
        this.expertData = { ...this.expertData, doctorsList: this.doctorsList, doctorType: this.doctorType };
        this.GetData.storedBookExpertData.next(this.expertData);
      }
    })
  }

  labTestApicall() {
    this.GetData.storedBookLabTestData.subscribe(res => {
      if (res === null) {
        this.getLabTestList();
        this.getLabTestConfigList();
      } else {
        this.testList = res?.testList;
        this.testConfig = res?.testConfig;
      }
    })
  }

  /**
  * Method to get the list of Lab Tests from api 
  */
  getLabTestList() {
    this.subscriptions.push(this.thyrocareService.getTestsList({}).subscribe((data) => {
      if (data?.success) {
        this.testList = data.data?.gt_labs_config;
        this.labTestData = { ...this.labTestData, testList: this.testList };
        this.GetData.storedBookLabTestData.next(this.labTestData);
      }
    }));
  }

  /**
   * Method to get the list of Lab Tests from api 
   */
  getLabTestConfigList() {
    this.subscriptions.push(this.labTestConfigService.getLabTestConfig().subscribe((data) => {
      if (data?.success) {
        this.testConfig = JSON.parse(data.data?.gtmp_value);
        this.labTestData = { ...this.labTestData, testConfig: this.testConfig };
        this.GetData.storedBookLabTestData.next(this.labTestData);
      }
    }));
  }

  /**
   * Clear subscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


}
