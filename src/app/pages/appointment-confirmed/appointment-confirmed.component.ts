import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LocalStorageService } from 'src/app/modules/shared/services/local-storage/local-storage.service';
import { NavigateService } from '../../modules/shared/helper-utils/navigate.service';
import { FileUploadService } from '../../modules/shared/services/file-upload/file-upload.service';

import { InvoiceUploadService } from '../../modules/shared/services/invoice-upload/invoice-upload.service';
import { Title } from '@angular/platform-browser';
import { CommonUtil } from 'src/app/utils/common-util';

@Component({
  selector: 'app-appointment-confirmed',
  templateUrl: './appointment-confirmed.component.html',
  styleUrls: ['./appointment-confirmed.component.scss']
})
export class AppointmentConfirmedComponent implements OnInit, OnDestroy {

  transactionDetails: any;
  userDetails: any;
  subscriptions: Subscription[] = []

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private navigateService: NavigateService,
    private localStorageService: LocalStorageService,
    private invoiceUploadService: InvoiceUploadService,
    private titleService: Title) {
    this.transactionDetails = this.router.getCurrentNavigation()?.extras.state;
    if (!this.transactionDetails) {
      this.navigateService.navigation(['dashboard']);
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Gytree - Appointment Confirmed');
    this.userDetails = this.localStorageService.getItem('userSlug');
    this.transactionDetails.transactionDetails.date = CommonUtil.parseDate(this.transactionDetails?.transactionDetails?.gto_date);
  }

  uploadInvoice(invoice: any, fileUrl: any) {
    const payload = {
      gtiv_guid: invoice?.gtiv_guid,
      gtiv_order_uid: invoice?.gtiv_order_uid,
      gtiv_pdf: fileUrl,
      gtiv_user_email: invoice?.gtiv_user_email,
      type: this.transactionDetails.type,
      gtiv_test_name: this.transactionDetails.type === "labtest" ? invoice?.gtiv_details?.Test_Name : "",
      gtiv_user_name: invoice?.gtiv_user_name,
      gtiv_refrence_id: this.transactionDetails.type === "consultation" ? invoice?.gtiv_refrence_id : ""
    }
    this.subscriptions.push(this.invoiceUploadService.uploadInvoice(payload).subscribe(data => {
      if (data?.success) {
      }
      this.cdr.detectChanges();
    }))
  }

  /**
   * Click Handler to continue and redirect
   * after scheduling the appointment
   */
  continueClickHandler() {
    this.navigateService.navigation(['dashboard']);
  }

  /**
   * Clear subscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
