import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { INVOICE_LIST_SCHEMA } from '../../modules/shared/models/invoice-list.constant';
import { GlobalBaseComponent } from '../../modules/shared/base-component/global-base/global-base.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent extends GlobalBaseComponent implements OnInit, OnDestroy {

  @ViewChild('test', { static: false }) test: ElementRef;

  ngOnInit(): void {
    this.titleService.setTitle('Gytree - Invoice');
    document?.getElementById('kt_wrapper')?.classList?.add('pe-xl-0');
    this.allInvoiceApiCall();
  }

  /**          
   * Click Handler to download the invoice pdf
   * @param url URL to download pdf
   */
  downloadInvoiceClick(invoice: INVOICE_LIST_SCHEMA) {
    window.open(invoice?.gtiv_pdf);
  }

  /**
   * Clear subscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.invoicesubscriptions.forEach((subscription) => subscription.unsubscribe());
    document?.getElementById('kt_wrapper')?.classList?.remove('pe-xl-0');
  }
}
