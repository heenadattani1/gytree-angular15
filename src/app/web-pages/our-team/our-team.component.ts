import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { DOCTOR_DETAILS_SCHEMA } from 'src/app/modules/shared/models/doctor-details.constant';
import { NavigateService } from '../../modules/shared/helper-utils/navigate.service';
import { DoctorsListService } from '../../modules/shared/services/doctors-list/doctors-list.service';
import { Meta, Title } from '@angular/platform-browser';
import { CommonUtil } from 'src/app/utils/common-util';
import { PackageListService } from 'src/app/modules/shared/services/package-list/package-list.service';
import { UserAgewiseListService } from 'src/app/modules/shared/services/user-agewise-list/user-agewise-list.service';
import { HealthClinicListService } from 'src/app/modules/shared/services/health-clinic-list/health-clinic-list.service';
import { ArticlesListService } from 'src/app/modules/shared/services/articles-list/articles-list.service';
import { HOME_CONSTANT_CONFIG } from '../home/home.constant';
import { StoreDataService } from 'src/app/shared/services/store-data.service';
import { FaqListService } from 'src/app/modules/shared/services/faq-list/faq-list.service';
import { BannerListService } from 'src/app/modules/shared/services/banner-list/banner-list.service';
import { VideosListService } from 'src/app/modules/shared/services/videos-list/videos-list.service';
import { WhatWeTreatService } from 'src/app/modules/shared/services/what-we-treat/what-we-treat.service';
import { WhyUseGytreeService } from 'src/app/modules/shared/services/why-use-gytree/why-use-gytree.service';
import { GetDataService } from 'src/app/shared/services/get-data.service';
import { ThyrocareService } from 'src/app/modules/shared/services/thyrocare/thyrocare.service';
import { LabTestConfigService } from 'src/app/modules/shared/services/lab-test-config/lab-test-config.service';

import { LoaderService } from '../../shared/services/loader.service';
import { MetaTagsEnum } from '../../shared/constants/meta-tags.enum';
import { MetaTagsService } from '../../modules/shared/services/meta-tags/meta-tags.service';
import { EventTrackingService } from '../../shared/services/event-tracking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-our-team',
  templateUrl: './our-team.component.html',
  styleUrls: ['./our-team.component.scss'],
})
export class OurTeamComponent
  extends StoreDataService
  implements OnInit, OnDestroy
{
  list: OwlOptions;
  listOptions: OwlOptions;
  withOutNavBarOption: OwlOptions;
  isLoading: boolean = true;

  doctorType: string[];
  doctorsList: DOCTOR_DETAILS_SCHEMA | any;
  subscriptions: Subscription[] = [];
  articleList: OwlOptions = HOME_CONSTANT_CONFIG.articleList;

  constructor(
    public metaService: Meta,
    public cdr: ChangeDetectorRef,
    modalService: NgbModal,
    public navigateService: NavigateService,
    doctorsListService: DoctorsListService,
    packagesListService: PackageListService,
    agewiseListService: UserAgewiseListService,
    healthClinicListService: HealthClinicListService,
    articlesListService: ArticlesListService,
    faqListService: FaqListService,
    bannerListService: BannerListService,
    videosListService: VideosListService,
    whatWeTreatService: WhatWeTreatService,
    whyUseGytreeService: WhyUseGytreeService,
    thyrocareService: ThyrocareService,
    labTestConfigService: LabTestConfigService,
    GetData: GetDataService,
    loaderService: LoaderService,
    private metaTagsService: MetaTagsService,
    private eventTrackingService: EventTrackingService,
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
    this.checkIsLoading();
    this.BookAnExpertApicall();
    this.commonApicall();
    this.setMetaTagAndTitle();
  }

  /**
   * Method to display all the packages of particular type
   */
  viewAll(type: string) {
    this.doctorsList[type].viewAll = true;
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

  onToggleConsultConsultHealthClinic(consult: any) {
    consult.isOpen = !consult.isOpen;
  }

  /**
   * Method for redirecting to Consult Screen
   * @param slug doctor slug
   */
  goToConsult(doctorData: DOCTOR_DETAILS_SCHEMA) {
    this.eventTrackingService.trackEvent(
      'Book Now Clicked',
      'Consultation_' + doctorData.gtd_slug
    );
    this.navigateService.navigation(['consult', doctorData.gtd_slug], {
      queryParams: { type: doctorData.gtd_type },
    });
  }

  /**
   * Method for redirecting to Doctor's detail screen
   * @param slug doctor slug
   */
  viewDoctorProfile(doctorData: DOCTOR_DETAILS_SCHEMA) {
    this.navigateService.navigation(['doctor-details', doctorData.gtd_slug], {
      queryParams: { type: doctorData.gtd_type },
    });
  }

  /**
   * Clear subscriptions when component complete the process
   */
 /*  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  } */

  /**
   * Meta tag and title
   */
  setMetaTagAndTitle() {
    this.metaTagsService?.metaTags.subscribe((res) => {
      if (res) {
        let metaData = res.filter((ele) => {
          return ele.meta_type === MetaTagsEnum.OUR_EXPERT;
        });
        const data = {
          title: 'Gytree - Our Care Team',
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
