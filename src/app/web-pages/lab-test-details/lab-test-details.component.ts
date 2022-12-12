import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { NavigateService } from '../../modules/shared/helper-utils/navigate.service';
import { ModalBaseClass } from '../../modules/shared/modals/base_class/modal-base-class';
import { AGE_LIST_SCHEMA } from '../../modules/shared/models/age-list.constant';
import { HEALTH_CLINIC_LIST_SCHEMA } from '../../modules/shared/models/health-clinic-list.constant';
import { ArticlesListService } from '../../modules/shared/services/articles-list/articles-list.service';
import { HealthClinicListService } from '../../modules/shared/services/health-clinic-list/health-clinic-list.service';
import { LabTestDetailsService } from '../../modules/shared/services/lab-test-details/lab-test-details.service';
import { UserAgewiseListService } from '../../modules/shared/services/user-agewise-list/user-agewise-list.service';
import { AreaCodeComponent } from '../../pages/area-code/area-code.component';
import { EventTrackingService } from '../../shared/services/event-tracking.service';
import { CommonUtil } from '../../utils/common-util';
import { HOME_CONSTANT_CONFIG } from '../home/home.constant';

@Component({
  selector: 'app-lab-test-details',
  templateUrl: './lab-test-details.component.html',
  styleUrls: ['./lab-test-details.component.scss'],
})
export class LabTestDetailsComponent
  extends ModalBaseClass
  implements OnInit, OnDestroy
{
  articles: any;
  ages: AGE_LIST_SCHEMA[];
  consults: HEALTH_CLINIC_LIST_SCHEMA[];
  labTestSlug;
  test;
  articleList: OwlOptions;
  homeConstantConfig = HOME_CONSTANT_CONFIG;

  subscriptions: Subscription[] = [];

  constructor(
    private metaService: Meta,
    private titleService: Title,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    modalService: NgbModal,
    private navigateService: NavigateService,
    private articlesListService: ArticlesListService,
    private agewiseListService: UserAgewiseListService,
    private labTestDetailService: LabTestDetailsService,
    private healthClinicListService: HealthClinicListService,
    private eventTrackingService: EventTrackingService
  ) {
    super(modalService);
  }

  ngOnInit(): void {
    // this.titleService.setTitle('Gytree - Lab Test Details');
    this.articleList = this.homeConstantConfig.articleList;
    this.route.paramMap.subscribe((params: any) => {
      this.labTestSlug = params.params.slug;
    });
    this.getLabTestDetails();
    this.getAgewiseList();
    this.getHealthClinicsList();
    this.getArticlesList();
  }

  /**
   * Method to get the Details of selected Doctor from api
   */
  getLabTestDetails() {
    const payload = {
      lab_slug: this.labTestSlug,
    };
    this.subscriptions.push(
      this.labTestDetailService.getLabTestDetails(payload).subscribe((data) => {
        if (data?.success) {
          this.test = data.data.data;
          this.setMetaTagAndTitle();
          this.cdr.detectChanges();
        }
      })
    );
    setTimeout(() => {
      window.scroll(0, 0);
    }, 100);
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

  onToggleConsultHealthClinic(consult: any) {
    consult.isOpen = !consult.isOpen;
  }

  /**
   * Click Handler for opening selected Article in new Tab
   * @param url article url
   */
  articleClickHandler(url: string) {
    window.open(url, '_blank');
  }

  /**
   * Method to get the User Agewise list from api
   */
  getAgewiseList() {
    this.agewiseListService.getUserAgewiseList().subscribe((res) => {
      if (res?.success) {
        this.ages = res.data;
        this.ages.sort((a: any, b: any) => {
          return a.gtag_guid - b.gtag_guid;
        });
      }
    });
  }

  /**
   * Method to get the Health Clinics list from api
   */
  getHealthClinicsList() {
    let payload = {};
    this.healthClinicListService
      .getHealthClinicList(payload)
      .subscribe((res) => {
        if (res?.success) {
          this.consults = res.data;
        }
      });
  }

  /**
   * Method to get the Articles list from api
   */
  getArticlesList() {
    this.articlesListService.getArticlesList().subscribe((res) => {
      if (res?.success) {
        this.articles = res.data;
      }
    });
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

  // Meta tag and title
  setMetaTagAndTitle() {
    const data = {
      title: 'Gytree - Lab Test Details',
      metaTitle: this.test?.gtl_meta_title || "Gytree.com for Women's Health",
      metaDescription:
        this.test?.gtl_meta_desc ||
        "Women's Health India - Personalised packages, consultations and products for women with PCOS, menopause, mental health, and other hormonal issues",
      metaKeyword:
        this.test?.gtl_meta_keywords ||
        "women's health india, pcos programs india, gut health india, menopause india",
      metaImage:
        this.test?.gtl_meta_image ||
        'https://image.gytree.com/images/image/gytree_new.jpg',
    };
    CommonUtil.setMetaTagAndTitle(this.titleService, this.metaService, data);
  }
}
