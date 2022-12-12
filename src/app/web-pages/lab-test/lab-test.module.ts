import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabTestComponent } from './lab-test.component';
import { RouterModule } from '@angular/router';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';
import { SafePipeModule } from 'src/app/core/pipes/safe-pipe/safe-pipe.module';
import { CarouselModule } from 'ngx-owl-carousel-o';



@NgModule({
  declarations: [
    LabTestComponent
  ],
  imports: [
    CommonModule,
    ImageLazyLoadModule,
    SafePipeModule,
    CarouselModule,
    RouterModule.forChild([{
      path: '',
      component: LabTestComponent
    }])
  ]
})
export class LabTestModule { }
