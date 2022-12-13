import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ScheduleAppointmentComponent } from './schedule-appointment.component';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';



@NgModule({
  declarations: [
    ScheduleAppointmentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ScheduleAppointmentComponent,
      },
    ]),
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    NgbDatepickerModule,
    ImageLazyLoadModule
  ],
  exports: [ScheduleAppointmentComponent]
})
export class ScheduleAppointmentModule { }
