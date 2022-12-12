import { Component, OnDestroy, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PILL_LIST_SCHEMA } from 'src/app/modules/shared/models/pill-list.constant';
import { GlobalBaseComponent } from '../../modules/shared/base-component/global-base/global-base.component';
import { PILL_OPTION } from './prescription.constant';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent extends GlobalBaseComponent implements OnInit, OnDestroy {

  pillOption: OwlOptions = PILL_OPTION;

  ngOnInit(): void {
    this.prescriptionnotification_data = this.router.getCurrentNavigation()?.extras.state?.notification;
    this.titleService.setTitle('Gytree - Prescription');
    this.allPrescriptionApiCall();
  }

  /**
  * Method to handle frequancy of medicine
  */
  getMedicine(medicine: string, type: number) {
    return medicine.split('-')[type] ? medicine.split('-')[type] : 0
  }

  /**
  * Method to redirect
  */
  bookNowClickHandler(route: string) {
    this.navigateService.navigation([route]);
  }

  /**
   * Method to display appointment details in right sidebar
   * @param appointment Appointment  details Object
   */
  viewMoreClickHandler(appointment: PILL_LIST_SCHEMA) {
    this.prescriptionselectedPillList = appointment;
    this.prescriptionselectedPillFormat();
    this.cdr.detectChanges();
  }

  /**
   * Method to get the screen size
   */
  downloadPdf(url: any) {
    if (url) {
      window.open(url);
    }
  }

  /**
   * Method to redirect to packages screen for viewing all Packages 
   */
  viewAllPackages() {
    this.navigateService.navigation(['packages']);
  }

  /**
   * Clear prescriptionsubscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.prescriptionsubscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

