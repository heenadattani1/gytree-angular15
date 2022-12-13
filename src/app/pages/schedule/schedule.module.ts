import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ScheduleComponent } from './schedule.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageLazyLoadModule } from '../../shared/image-lazy-load/image-lazy-load.module';


@NgModule({
  declarations: [
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    RouterModule.forChild([
      {
        path: '',
        component: ScheduleComponent,
      },
    ]),
    InlineSVGModule,
    NgOptimizedImage,
    SharedModule
  ]
})
export class ScheduleModule { }
