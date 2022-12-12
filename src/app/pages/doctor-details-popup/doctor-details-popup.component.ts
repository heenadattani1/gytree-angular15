import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DOCTOR_DETAILS_SCHEMA } from '../../modules/shared/models/doctor-details.constant';
import { DoctorDetialsService } from '../../modules/shared/services/doctor-details/doctor-details.service';

@Component({
  selector: 'app-doctor-details-popup',
  templateUrl: './doctor-details-popup.component.html',
  styleUrls: ['./doctor-details-popup.component.scss']
})
export class DoctorDetailsPopupComponent implements OnInit, OnDestroy {

  @Input() doctorData: any;
  doctorDetails: DOCTOR_DETAILS_SCHEMA;
  subscriptions: Subscription[] = [];

  constructor(
    public modal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private doctorDetialsService: DoctorDetialsService,
  ) { }

  ngOnInit(): void {
    this.getDoctorDetails();
  }

  /**
   * Method to get the Details of selected Doctor from api 
   */
   getDoctorDetails() {
    this.subscriptions.push(this.doctorDetialsService.getDoctorDetialsById(this.doctorData.gtd_slug).subscribe((data) => {
      if (data?.success) {
        this.doctorDetails = data.data;
        this.cdr.detectChanges();
      }
    }));
    setTimeout(() => {
      window.scroll(0, 0);
    }, 100);
  }

  /**
   * Clear subscriptions when component complete the process
   */
   ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
