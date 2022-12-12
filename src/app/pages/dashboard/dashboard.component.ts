import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMAGE_TYPE_CONFIG } from '../../web-pages/package-details/package-details.constant';
import { NotificationComponent } from '../notification/notification.component';
import { NOTIFICATION_OPTIONS } from './dashboard.constant';
import { GlobalBaseComponent } from 'src/app/modules/shared/base-component/global-base/global-base.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends GlobalBaseComponent implements OnInit, OnDestroy {

  userDetails: any;
  IMAGE_TYPE_CONFIG: any = IMAGE_TYPE_CONFIG;
  notificationOption = NOTIFICATION_OPTIONS;


  ngOnInit(): void {
    this.userDetails = this.localStorageService.getItem('userSlug');
    document.body.classList.remove('overflow-hidden');
    document?.getElementById('kt_wrapper')?.classList?.add('pe-xl-0');
    this.titleService.setTitle('Gytree - Dashboard');
    this.allDashboardApiCall();
  }

  /**
   * Method to update notification list
   * @param id notification guid
   */
  updateDashboardList(id: any) {
    const payload = {
      gtnf_guid: (id && id.gtnf_guid)
    }
    this.dashBoardsubscriptions.push(this.dashboardListService.dashboardUpdate(payload).subscribe((data) => {
      if (data) {
        this.getDashboardList();
      }
    }));
  }

  /**
   * Method to get the details of reminder
   * @param id reminder id
   */
  notificationClickHandler(id: any) {
    const payload = {
      gtnf_guid: (id && id.gtnf_guid)
    }
    this.packagesListService.sendNotificationStatus(payload).subscribe(res => {
      if (id && id.gtnf_type == 'appointment') {
        this.navigateService.navigation(['schedule'], { state: { notification: id } });
      }
      else if (id && id.gtnf_type == 'Prescription') {
        this.navigateService.navigation(['schedule'], { state: { notification: id } });
      }
    })
  }

  /**
   * Method to redirect to packages screen for viewing all Packages 
   */
  viewAllPackages() {
    this.navigateService.navigation(['packages']);
  }

  /**
   * Click Handler to open popup for Notification Video/Audio/Pdf display 
   */
  openClickHandler(file: any) {
    const modalRef = this.openPopUp(NotificationComponent, { file }, {
      centered: true, size: 'xl', keyboard: true, backdrop: 'static'
    });
    modalRef.result.then((data) => {
      if (data && data.message === 'OK') {
      }
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Method to redirect
   */
  bookNowClickHandler(route: string) {
    this.navigateService.navigation([route]);
  }

  /**
   * Clear subscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.dashBoardsubscriptions.forEach((subscription) => subscription.unsubscribe());
    document?.getElementById('kt_wrapper')?.classList?.remove('pe-xl-0');
  }

}
