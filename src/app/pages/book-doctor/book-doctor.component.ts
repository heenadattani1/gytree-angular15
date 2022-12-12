import { Component, OnDestroy, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DOCTOR_DETAILS_SCHEMA } from 'src/app/modules/shared/models/doctor-details.constant';
import { OUR_TEAM_CONFIG } from 'src/app/web-pages/our-team/our-team.constant';
import { GlobalBaseComponent } from '../../modules/shared/base-component/global-base/global-base.component';
@Component({
  selector: 'app-book-doctor',
  templateUrl: './book-doctor.component.html',
  styleUrls: ['./book-doctor.component.scss']
})
export class BookDoctorComponent extends GlobalBaseComponent implements OnInit, OnDestroy {

  list: OwlOptions = OUR_TEAM_CONFIG.list;
  withOutNavBarOption: OwlOptions = OUR_TEAM_CONFIG.without_nav_option;
  listOptions: OwlOptions;
  
  ngOnInit(): void {
    this.titleService.setTitle('Gytree - Book Doctor');
    document?.getElementById('kt_wrapper')?.classList?.add('pe-xl-0');
    this.listOptions = OUR_TEAM_CONFIG.listOptions;
    this.allExpertApiCall();
  }

  /**
   * Method to display all the packages of particular type 
   * @param type doctor type
   */
  viewAll(type: string) {
    this.doctorsList[type].viewAll = true;
    this.doctorsList.type.viewAll = true;
  }

  /**
   * Method for redirecting to Consult Screen 
   * @param slug doctor slug
   */
  goToConsult(doctorData: DOCTOR_DETAILS_SCHEMA) {
    this.navigateService.navigation(['consult', doctorData.gtd_slug], { queryParams: { type: doctorData.gtd_type } });
    this.eventTrackingService.trackEvent('Book Now Clicked', 'Consultation_' + doctorData.gtd_slug);
  }

  /**
   * Method for redirecting to Doctor's detail screen
   * @param slug doctor slug
   */
  viewDoctorProfile(doctorData: DOCTOR_DETAILS_SCHEMA) {
    this.navigateService.navigation(['doctor-details', doctorData.gtd_slug], { queryParams: { type: doctorData.gtd_type } });
  }

  ngOnDestroy() {
    document?.getElementById('kt_wrapper')?.classList?.remove('pe-xl-0');
    this.expertsubscriptions.forEach((sb) => sb.unsubscribe());
  }
}
