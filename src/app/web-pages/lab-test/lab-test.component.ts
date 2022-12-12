import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { LabTestConfigService } from '../../modules/shared/services/lab-test-config/lab-test-config.service';
import { AreaCodeComponent } from '../../pages/area-code/area-code.component';
import { ThyrocareService } from '../../modules/shared/services/thyrocare/thyrocare.service';
import { Meta, Title } from '@angular/platform-browser';
import { CommonUtil } from 'src/app/utils/common-util';
import { HOME_CONSTANT_CONFIG } from '../home/home.constant';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AGE_LIST_SCHEMA } from 'src/app/modules/shared/models/age-list.constant';
import { HEALTH_CLINIC_LIST_SCHEMA } from 'src/app/modules/shared/models/health-clinic-list.constant';
import { PackageListService } from 'src/app/modules/shared/services/package-list/package-list.service';
import { UserAgewiseListService } from 'src/app/modules/shared/services/user-agewise-list/user-agewise-list.service';
import { HealthClinicListService } from 'src/app/modules/shared/services/health-clinic-list/health-clinic-list.service';
import { ArticlesListService } from 'src/app/modules/shared/services/articles-list/articles-list.service';
import { NavigateService } from 'src/app/modules/shared/helper-utils/navigate.service';
import { BannerListService } from 'src/app/modules/shared/services/banner-list/banner-list.service';
import { VideosListService } from 'src/app/modules/shared/services/videos-list/videos-list.service';
import { WhatWeTreatService } from 'src/app/modules/shared/services/what-we-treat/what-we-treat.service';
import { WhyUseGytreeService } from 'src/app/modules/shared/services/why-use-gytree/why-use-gytree.service';
import { DoctorsListService } from 'src/app/modules/shared/services/doctors-list/doctors-list.service';
import { FaqListService } from 'src/app/modules/shared/services/faq-list/faq-list.service';
import { StoreDataService } from 'src/app/shared/services/store-data.service';
import { GetDataService } from 'src/app/shared/services/get-data.service';
import { LoaderService } from '../../shared/services/loader.service';
import { MetaTagsEnum } from '../../shared/constants/meta-tags.enum';
import { MetaTagsService } from '../../modules/shared/services/meta-tags/meta-tags.service';
import { EventTrackingService } from '../../shared/services/event-tracking.service';

@Component({
  selector: 'app-lab-test',
  templateUrl: './lab-test.component.html',
  styleUrls: ['./lab-test.component.scss'],
})
export class LabTestComponent
  extends StoreDataService
  implements OnInit, OnDestroy
{
  subscriptions: Subscription[] = [];
  isLoading: boolean = true;

  articles: any;
  articleList: OwlOptions = HOME_CONSTANT_CONFIG.articleList;
  ages: AGE_LIST_SCHEMA[];
  consults: HEALTH_CLINIC_LIST_SCHEMA[];

  constructor(
    public metaService: Meta,
    modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    thyrocareService: ThyrocareService,
    packagesListService: PackageListService,
    agewiseListService: UserAgewiseListService,
    healthClinicListService: HealthClinicListService,
    articlesListService: ArticlesListService,
    private navigateService: NavigateService,
    labTestConfigService: LabTestConfigService,
    bannerListService: BannerListService,
    videosListService: VideosListService,
    whatWeTreatService: WhatWeTreatService,
    whyUseGytreeService: WhyUseGytreeService,
    doctorsListService: DoctorsListService,
    faqListService: FaqListService,
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
    this.labTestApicall();
    this.commonApicall();
    this.setMetaTagAndTitle();
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
   * Method to update class of the Test config
   * @param index index of the selected Lab test
   */
  addTransformClass(index: number) {
    var addClass = '';
    switch (index % 4) {
      case 0:
        addClass = 'transform-1';
        break;
      case 1:
        addClass = 'transform-2';
        break;
      case 2:
        addClass = 'transform-3';
        break;
      case 3:
        addClass = 'transform-4';
    }
    return addClass;
  }

  /**
   * Method for redirecting to Billing Screen
   * @param test selected lab test
   */
  bookDoctor(test: any) {
    const modalRef = this.openPopUp(
      AreaCodeComponent,
      { labTest: test },
      {
        centered: true,
        size: 'md',
        keyboard: true,
        backdrop: 'static',
      }
    );
    modalRef.result.then(
      (data) => {
        if (data && data.message === 'OK') {
        }
      },
      (error) => {
        console.log(error);
      }
    );
    this.eventTrackingService.trackEvent(
      'Book Now Clicked',
      'Labtest_' + test.gtl_id
    );
  }

  /**
   * Clear subscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Meta tag and title
   */
  setMetaTagAndTitle() {
    this.metaTagsService?.metaTags.subscribe((res) => {
      if (res) {
        let metaData = res.filter((ele) => {
          return ele.meta_type === MetaTagsEnum.LAB_TEST;
        });
        const data = {
          title: 'Gytree - Lab Tests',
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
