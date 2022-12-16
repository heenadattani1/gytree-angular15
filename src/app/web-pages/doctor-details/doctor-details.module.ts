import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DoctorDetailsComponent } from './doctor-details.component';
import { RouterModule } from '@angular/router';
import { SafePipeModule } from '../../core/pipes/safe-pipe/safe-pipe.module';

@NgModule({
  declarations: [
    DoctorDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: DoctorDetailsComponent
    }]),
    SafePipeModule,
    NgOptimizedImage
  ]
})
export class DoctorDetailsModule { }
