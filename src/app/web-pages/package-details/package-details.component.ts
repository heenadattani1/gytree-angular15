import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute, Params } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery-9';
import { PackageListService } from '../../modules/shared/services/package-list/package-list.service';
import { PackageDetailsService } from '../../modules/shared/services/package-details/package-details.service';
import { IMAGE_TYPE_CONFIG, PACKAGE_DETAILS_CONFIG } from './package-details.constant';
import { NavigateService } from '../../modules/shared/helper-utils/navigate.service';
import { DoctorsListService } from '../../modules/shared/services/doctors-list/doctors-list.service';
import { PACKAGE_SCHEMA, PACKAGE_SCHEMA1 } from '../../modules/shared/models/package-list.constant';
import { DOCTOR_DETAILS_SCHEMA } from 'src/app/modules/shared/models/doctor-details.constant';
import { CAROUSEL_CONFIG } from 'src/app/modules/shared/constants/carousel-config.constant';
import { OUR_TEAM_CONFIG } from '../our-team/our-team.constant';
import { Meta, Title } from '@angular/platform-browser';
import { HOME_CONSTANT_CONFIG } from '../home/home.constant';
import { AGE_LIST_SCHEMA } from 'src/app/modules/shared/models/age-list.constant';
import { HEALTH_CLINIC_LIST_SCHEMA } from 'src/app/modules/shared/models/health-clinic-list.constant';
import { UserAgewiseListService } from 'src/app/modules/shared/services/user-agewise-list/user-agewise-list.service';
import { HealthClinicListService } from 'src/app/modules/shared/services/health-clinic-list/health-clinic-list.service';
import { ArticlesListService } from 'src/app/modules/shared/services/articles-list/articles-list.service';
import { CommonUtil } from '../../utils/common-util';
import { EventTrackingService } from '../../shared/services/event-tracking.service';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss']
})
export class PackageDetailsComponent implements OnInit, OnDestroy {

  mobileScreen: boolean;
  teamList: OwlOptions;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  packageDetail: PACKAGE_SCHEMA;
  otherPackages: PACKAGE_SCHEMA1 = {
    carouselOptions: CAROUSEL_CONFIG.carouselOptions,
    packageData: []
  }
  doctorsList: DOCTOR_DETAILS_SCHEMA | any;
  doctorsArray: DOCTOR_DETAILS_SCHEMA[] = [];
  showLongDesc: boolean = false;

  package_slug: string;
  CONSULTATION_CONFIG: any = IMAGE_TYPE_CONFIG;
  packageDetailsConfig = PACKAGE_DETAILS_CONFIG;
  subscriptions: Subscription[] = [];

  articles: any;
  articleList: OwlOptions = HOME_CONSTANT_CONFIG.articleList;
  ages: AGE_LIST_SCHEMA[];
  consults: HEALTH_CLINIC_LIST_SCHEMA[];

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth();
  }

  constructor(
    public metaService: Meta,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private navigateService: NavigateService,
    private doctorsListService: DoctorsListService,
    private packageListService: PackageListService,
    private packageDetailsService: PackageDetailsService,
    private agewiseListService: UserAgewiseListService,
    private healthClinicListService: HealthClinicListService,
    private articlesListService: ArticlesListService,
    private eventTrackingService: EventTrackingService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.screenWidth();
    this.listsConfig();
    this.route.paramMap.subscribe((params: any) => {
      this.package_slug = params.params.slug;
      this.doctorsArray = [];
      this.setMetaTagAndTitle();
      this.getPackagedetails();
      this.getDoctorsList();
      this.getAgewiseList();
      this.getHealthClinicsList();
      this.getArticlesList();
    });
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
  }

  /**
   * This method will display the long description of the package
   */
  displayLongDesc() {
    this.showLongDesc = true;
  }

  /**
   * Method to get Configuration of all the lists on Package Details screen
   */
  listsConfig() {
    this.teamList = this.packageDetailsConfig.teamList;
    this.galleryOptions = this.packageDetailsConfig.galleryOptions;
  }

  /**
   * Method to get the Details of selected Package from api 
   */
  getPackagedetails() {
    this.subscriptions.push(this.packageDetailsService.getPackageDetailsById(this.package_slug).subscribe(data => {
      if (data?.success) {
        this.packageDetail = data?.data;
        this.galleryImages = [];
        (data?.data?.gtp_thumbnail || []).forEach((element: string) => {
          this.galleryImages.push({
            small: element,
            medium: element,
            big: element
          })
        });
        this.otherPackagesList();
      }
    }));
  }

  /**
   * Method to get the list of doctors from api 
   */
  getDoctorsList() {
    this.subscriptions.push(this.doctorsListService.getdoctors().subscribe(data => {
      if (data?.success) {
        this.doctorsList = data.data;
        Object.keys(this.doctorsList).forEach((doctor: string) => {
          this.doctorsList[doctor].forEach((element: DOCTOR_DETAILS_SCHEMA) => {
            this.doctorsArray.push(element);
          })
        })
      }
    }));
  }

  /**
   * Method to get the User Agewise list from api 
   */
  getAgewiseList() {
    this.subscriptions.push(this.agewiseListService.getUserAgewiseList().subscribe(data => {
      if (data?.success) {
        this.ages = data.data;
        this.ages.sort((a: any, b: any) => {
          return a.gtag_guid - b.gtag_guid;
        })
      }
    }));
  }

  /**
   * Method to get the Health Clinics list from api 
   */
  getHealthClinicsList() {
    let payload = {};
    this.subscriptions.push(this.healthClinicListService.getHealthClinicList(payload).subscribe(data => {
      if (data?.success) {
        this.consults = data.data;
      }
    }));
  }

  /**
   * Method to get the Articles list from api 
   */
  getArticlesList() {
    this.subscriptions.push(this.articlesListService.getArticlesList().subscribe(data => {
      if (data?.success) {
        this.articles = data.data;
      }
    }));
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
    window.open(url, "_blank");
  }

  onToggleConsultConsultHealthClinic(consult: any) {
    consult.isOpen = !consult.isOpen;
  }

  /**
   * Method to get the Details of other similar packages 
   */
  otherPackagesList() {
    this.subscriptions.push(this.packageListService.getPackagesList().subscribe(data => {
      if (data?.success) {
        const otherPackages = data.data.filter((packageData: PACKAGE_SCHEMA) =>
          packageData.gtp_slug !== this.package_slug
        );
        this.otherPackages.packageData = otherPackages.slice(0, 5);
        if (this.otherPackages.packageData.length < 4) {
          this.otherPackages.carouselOptions = OUR_TEAM_CONFIG.list
        }
        this.cdr.detectChanges();
      }
    }));
  }

  /**
   * Method for redirecting to Doctor's details Screen 
   * @param slug doctor slug
   */
  goToConsult(slug: string) {
    this.navigateService.navigation(['doctor-details', slug]);
  }

  /**
  * Method for redirecting to Schedule Screen
  * @param slug package slug
  */
  schedulePackage(slug: string) {
    this.navigateService.navigation(['/schedule-appointment', slug]);
    this.eventTrackingService.trackEvent('Book Now Clicked', 'Package_' + slug);
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
      title: 'Gytree - Package Details',
      metaTitle: this.packageDetail?.gtp_meta_title || "Gytree.com for Women's Health",
      metaDescription: this.packageDetail?.gtp_meta_desc || "Women's Health India - Personalised packages, consultations and products for women with PCOS, menopause, mental health, and other hormonal issues",
      metaKeyword: this.packageDetail?.gtp_meta_keywords || "women's health india, pcos programs india, gut health india, menopause india",
      metaImage: this.packageDetail?.gtp_meta_image || 'https://image.gytree.com/images/image/gytree_new.jpg',
    }
    CommonUtil.setMetaTagAndTitle(this.titleService, this.metaService, data)
  }

}
