import { Component, OnDestroy, OnInit } from '@angular/core';
import { AreaCodeComponent } from '../area-code/area-code.component';
import { GlobalBaseComponent } from '../../modules/shared/base-component/global-base/global-base.component';

@Component({
  selector: 'app-book-test',
  templateUrl: './book-test.component.html',
  styleUrls: ['./book-test.component.scss']
})
export class BookTestComponent extends GlobalBaseComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.titleService.setTitle('Gytree - Book Test');
    document?.getElementById('kt_wrapper')?.classList?.add('pe-xl-0');
    this.allLabTestApiCall();
  }

  onClickPackageDetail(book: any) {
    book.isOpen = !book.isOpen;
  }

  /**
   * Model open for get a pincode during book a test
   * @param test Lab test details
   */
  bookDoctor(test: any) {
    const modalRef = this.openPopUp(AreaCodeComponent, { labTest: test }, {
      centered: true, size: 'md', keyboard: true, backdrop: 'static'
    });
    modalRef.result.then((data) => {
      if (data && data.message === 'OK') {
        
      }
    }, (error) => {
      console.log(error);
    });
    this.eventTrackingService.trackEvent('Book Now Clicked', 'Labtest_' + test.gtl_id);
  }

  /**
   * Clear subscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.labTestsubscriptions.forEach((subscription) => subscription.unsubscribe());
    document?.getElementById('kt_wrapper')?.classList?.remove('pe-xl-0');
  }

}
