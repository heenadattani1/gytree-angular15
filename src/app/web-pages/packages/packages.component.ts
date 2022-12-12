import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { PackageListService } from '../../modules/shared/services/package-list/package-list.service';
import { CAROUSEL_CONFIG } from 'src/app/modules/shared/constants/carousel-config.constant';
import { Meta, Title } from '@angular/platform-browser';
import { CommonUtil } from 'src/app/utils/common-util';
import { UserAgewiseListService } from 'src/app/modules/shared/services/user-agewise-list/user-agewise-list.service';
import { HealthClinicListService } from 'src/app/modules/shared/services/health-clinic-list/health-clinic-list.service';
import { ArticlesListService } from 'src/app/modules/shared/services/articles-list/articles-list.service';
import { NavigateService } from 'src/app/modules/shared/helper-utils/navigate.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HOME_CONSTANT_CONFIG } from '../home/home.constant';
import { FaqListService } from 'src/app/modules/shared/services/faq-list/faq-list.service';
import { BannerListService } from 'src/app/modules/shared/services/banner-list/banner-list.service';
import { VideosListService } from 'src/app/modules/shared/services/videos-list/videos-list.service';
import { WhatWeTreatService } from 'src/app/modules/shared/services/what-we-treat/what-we-treat.service';
import { GetDataService } from 'src/app/shared/services/get-data.service';
import { WhyUseGytreeService } from 'src/app/modules/shared/services/why-use-gytree/why-use-gytree.service';
import { DoctorsListService } from 'src/app/modules/shared/services/doctors-list/doctors-list.service';
import { StoreDataService } from 'src/app/shared/services/store-data.service';
import { ThyrocareService } from 'src/app/modules/shared/services/thyrocare/thyrocare.service';
import { LabTestConfigService } from 'src/app/modules/shared/services/lab-test-config/lab-test-config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../shared/services/loader.service';
import { MetaTagsEnum } from '../../shared/constants/meta-tags.enum';
import { MetaTagsService } from '../../modules/shared/services/meta-tags/meta-tags.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
})
export class PackagesComponent
  extends StoreDataService
  implements OnInit, OnDestroy
{
  filterType: string | null;
  filter: string | null;
  subscriptions: Subscription[] = [];
  CAROUSEL_CONFIG = CAROUSEL_CONFIG;

  articleList: OwlOptions = HOME_CONSTANT_CONFIG.articleList;

  content = [
    {
      key: '18-25',
      data: 'Girls and women between 18 to 25 years of age need special care and nutrition. These packages are especially curated to focus on your age needs and potential issues you will face. Each of our packages are backed by research and trusted by doctors.',
    },
    {
      key: '25-38',
      data: 'Women between 25 and 38 years of age deserve attention to their strength, early signs of issues around sexual and gynaec and nutrition. These packages are especially curated to focus on your age needs and potential issues you will face. Each of our packages are backed by research and trusted by doctors.',
    },
    {
      key: '38+',
      data: 'Women from 38 onwards need to pay attention to many changes taking place in the body. From hormones to pain and potential signs of chronic diseases, reviewing your health with our packages is critical. These packages are especially curated to focus on your age needs and potential issues you will face. Each of our packages are backed by research and trusted by doctors.',
    },
  ];
  currentContent: any;
  isLoading: boolean = true;

  constructor(
    public metaService: Meta,
    private route: ActivatedRoute,
    modalService: NgbModal,
    loaderService: LoaderService,
    packagesListService: PackageListService,
    agewiseListService: UserAgewiseListService,
    healthClinicListService: HealthClinicListService,
    articlesListService: ArticlesListService,
    private navigateService: NavigateService,
    faqListService: FaqListService,
    bannerListService: BannerListService,
    videosListService: VideosListService,
    whatWeTreatService: WhatWeTreatService,
    whyUseGytreeService: WhyUseGytreeService,
    GetData: GetDataService,
    doctorsListService: DoctorsListService,
    thyrocareService: ThyrocareService,
    labTestConfigService: LabTestConfigService,
    private metaTagsService: MetaTagsService,
    private titleService: Title
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
    window.scroll(0, 0);
    this.checkIsLoading();
    this.setMetaTagAndTitle();
    this.route.paramMap.subscribe((params: any) => {
      this.filterType = params.params['filter-type'];
      this.filter = params.params['filter'];
      this.getPackagesApicall(this.filterType, this.filter);
      this.commonApicall();
      this.currentContent = this.content.find(
        (data) => data.key === this.filter
      );
      if (this.filter) this.packages.packageData = this.packages[this.filter];
      else this.packages.packageData = this.packages.allPackages;
      const pData: any = _.groupBy(this.packages?.packageData, 'gtp_type_name');
      this.packages = { ...this.packages, packageData: pData };
      this.packageType = Object.keys(this.packages.packageData);
      const startValue = 'Gynaecology';
      this.packageType.sort((x, y) => {
        return x === startValue ? -1 : y === startValue ? 1 : 0;
      });
      this.type = this.packageType[0];
    });
  }

  /**
   * Click Handler for Age Group selection
   * @param age age group selection
   */
  ageGroupClickHandler(age: string) {
    window.scroll(0, 0);
    this.navigateService.navigation(['/packages', 'age', age]);
  }

  /**
   * Click Handler for Health Clinic selection
   * @param clinic health clinic selection
   */
  healthClinicClickHandler(clinic: string) {
    window.scroll(0, 0);
    this.navigateService.navigation(['/packages', 'health-clinic', clinic]);
  }

  /**
   * Click Handler for opening selected Article in new Tab
   * @param url article url
   */
  articleClickHandler(url: string) {
    window.open(url, '_blank');
  }

  onToggleConsultConsultHealthClinic(consult: any) {
    consult.isOpen = !consult.isOpen;
  }

  /**
   * Method to display all the packages of particular type
   */
  viewAll() {
    this.packages.packageData[this.type].viewAll = true;
  }

  /**
   * Method to change type of selected packages
   * @param type type of packages
   */
  selectedPackageType(type: string) {
    this.type = type;
  }

  /**
   * Clear subscriptions when component complete the process
   */
/*   ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  } */

  /**
   * Meta tag and title
   */
  setMetaTagAndTitle() {
    this.metaTagsService?.metaTags.subscribe((res) => {
      if (res) {
        let metaData = res.filter((ele) => {
          return ele.meta_type === MetaTagsEnum.PACKAGES;
        });
        const data = {
          title: 'Gytree - Our Packages',
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
    });
  }
}
