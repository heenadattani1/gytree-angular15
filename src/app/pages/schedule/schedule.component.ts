import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { GlobalBaseComponent } from '../../modules/shared/base-component/global-base/global-base.component';
import { APPOINTMENT_SCHEMA } from '../../modules/shared/models/appointment-list.constant';
import { NotificationComponent } from '../notification/notification.component';
import { APPOINTMENT_LIST_OPTIONS } from './schedule.constant';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent extends GlobalBaseComponent implements OnInit {

  appointmentListOptions: OwlOptions = APPOINTMENT_LIST_OPTIONS;
  outerHeight: number;




  ngOnInit(): void {
    this.schedulenotification_data = this.router.getCurrentNavigation()?.extras.state?.notification;
    this.titleService.setTitle('Gytree - Schedule');
    this.allScheduleApiCall();
  }

  setTimeFormat(gtoTime: string) {
    if (gtoTime) {
      const data = gtoTime.includes('-') ? gtoTime.split('-') : gtoTime.split('to');
      const startTime = data[0].trim().split(':');
      const endTime = data[1].trim().split(':');
      const startTimeHour = Number(startTime[0]);
      const startTimeMinute = Number(startTime[1]);
      const endTimeHour = Number(endTime[0]);
      const endTimeMinute = Number(endTime[1]);
      if (startTimeHour >= 12 && endTimeHour >= 12)
        return String((startTimeHour - 12 ? startTimeHour - 12 : 12) < 10 ? '0' + (startTimeHour - 12 ? startTimeHour - 12 : 12) : (startTimeHour - 12 ? startTimeHour - 12 : 12)) + ':' + String(startTimeMinute === 0 ? '00' : startTimeMinute) + 'PM' + ' to ' + String((endTimeHour - 12 ? endTimeHour - 12 : 12) < 10 ? '0' + (endTimeHour - 12 ? endTimeHour - 12 : 12) : (endTimeHour - 12 ? endTimeHour - 12 : 12)) + ':' + String(endTimeMinute === 0 ? '00' : endTimeMinute) + 'PM';
      if (startTimeHour >= 12)
        return String((startTimeHour - 12 ? startTimeHour - 12 : 12) < 10 ? '0' + (startTimeHour - 12 ? startTimeHour - 12 : 12) : (startTimeHour - 12 ? startTimeHour - 12 : 12)) + ':' + String(startTimeMinute === 0 ? '00' : startTimeMinute) + 'PM' + ' to ' + String(endTimeHour < 10 ? '0' + endTimeHour : endTimeHour) + ':' + String(endTimeMinute === 0 ? '00' : endTimeMinute) + 'AM';
      if (endTimeHour >= 12)
        return String(startTimeHour < 10 ? '0' + startTimeHour : startTimeHour) + ':' + String(startTimeMinute === 0 ? '00' : startTimeMinute) + 'AM' + ' to ' + + String((endTimeHour - 12 ? endTimeHour - 12 : 12) < 10 ? '0' + (endTimeHour - 12 ? endTimeHour - 12 : 12) : (endTimeHour - 12 ? endTimeHour - 12 : 12)) + ':' + String(endTimeMinute === 0 ? '00' : endTimeMinute) + 'PM';
      else
        return data[0].trim() + 'AM' + ' to ' + data[1].trim() + 'AM';
    }
    return ''
  }

  /**
   * Method to display appointment details in right sidebar
   * @param appointment Appointment  details Object
   */
  viewMoreClickHandler(appointment: APPOINTMENT_SCHEMA) {
    this.scheduleselectedAppointment = appointment;
    this.cdr.detectChanges();
  }

  /**
  * Method to redirect
  */
  bookNowClickHandler(route: string) {
    this.navigateService.navigation([route]);
  }

  /**
   * Method to redirect to packages screen for viewing all Packages 
   */
  viewAllPackages() {
    this.navigateService.navigation(['packages']);
  }

  /**
   * Click Handler to open popup for Video/Audio/Pdf display 
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
   * Clear subscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.schedulesubscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
