import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LabTestDetailsComponent } from './lab-test-details.component';
import { SafePipeModule } from '../../core/pipes/safe-pipe/safe-pipe.module';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
@NgModule({
  declarations: [
    LabTestDetailsComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    SafePipeModule,
    CarouselModule,
    RouterModule.forChild([{
      path: '',
      component: LabTestDetailsComponent
    }])
  ]
})
export class LabTestDetailsModule { }
