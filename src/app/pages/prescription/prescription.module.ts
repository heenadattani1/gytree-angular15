import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PrescriptionComponent } from './prescription.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';

const routes = [
  {
    path: '',
    component: PrescriptionComponent,
  },
]

@NgModule({
  declarations: [
    PrescriptionComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    RouterModule.forChild(routes),
    InlineSVGModule,
    NgOptimizedImage,
    SharedModule
  ]
})
export class PrescriptionModule { }
