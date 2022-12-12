import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentConfirmedComponent } from './appointment-confirmed.component';
import { RouterModule } from '@angular/router';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';



@NgModule({
  declarations: [
    AppointmentConfirmedComponent
  ],
  imports: [
    CommonModule,
    ImageLazyLoadModule,
    RouterModule.forChild([
      {
        path: '',
        component: AppointmentConfirmedComponent,
      },
    ]),
  ]
})
export class AppointmentConfirmedModule { }
