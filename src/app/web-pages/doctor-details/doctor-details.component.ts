import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigateService } from 'src/app/modules/shared/helper-utils/navigate.service';
import { DOCTOR_DETAILS_SCHEMA } from 'src/app/modules/shared/models/doctor-details.constant';
import { DoctorDetialsService } from 'src/app/modules/shared/services/doctor-details/doctor-details.service';
import { EventTrackingService } from '../../shared/services/event-tracking.service';
import { CommonUtil } from '../../utils/common-util';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss']
})
export class DoctorDetailsComponent implements OnInit, OnDestroy {

  doctorDetails: DOCTOR_DETAILS_SCHEMA;
  doctorType: string;
  subscriptions: Subscription[] = [];

  constructor(
    private metaService: Meta,
    private activatedRoute: ActivatedRoute,
    private doctorDetialsService: DoctorDetialsService,
    private navigateService: NavigateService,
    private cdr: ChangeDetectorRef,
    private eventTrackingService: EventTrackingService,
    private titleService: Title
  ) { }

  
  ngOnInit(): void {
    this.activatedRoute.queryParamMap
      .subscribe((params: any) => {
        this.doctorType = params.get('type') || '';
      });
    this.getDoctorDetails();
  }

  /**
   * Method to get the Details of selected Doctor from api 
   */
  getDoctorDetails() {
    this.subscriptions.push(this.doctorDetialsService.getDoctorDetialsById(this.activatedRoute.snapshot.paramMap.get('slug')).subscribe((data) => {
      if (data?.success) {
        this.doctorDetails = data.data;
        this.setMetaTagAndTitle();
        this.cdr.detectChanges();
      }
    }));
    setTimeout(() => {
      window.scroll(0, 0);
    }, 100);
  }

  /**
   * Method for redirecting to Consult Screen 
   */
  goToConsult() {
    this.navigateService.navigation(['consult', this.doctorDetails.gtd_slug], { queryParams: { type: this.doctorDetails.gtd_type } });
    this.eventTrackingService.trackEvent('Book Now Clicked', 'Consultation_' + this.doctorDetails.gtd_slug);
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
      title: 'Gytree - Doctor Details',
      metaTitle: this.doctorDetails?.gtd_meta_title || "Gytree.com for Women's Health",
      metaDescription: this.doctorDetails?.gtd_meta_desc || "Women's Health India - Personalised packages, consultations and products for women with PCOS, menopause, mental health, and other hormonal issues",
      metaKeyword: this.doctorDetails?.gtd_meta_keywords || "women's health india, pcos programs india, gut health india, menopause india",
      metaImage: this.doctorDetails?.gtd_meta_image || 'https://image.gytree.com/images/image/gytree_new.jpg',
    }
    CommonUtil.setMetaTagAndTitle(this.titleService, this.metaService, data)
  }
}
