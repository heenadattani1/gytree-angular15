import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatWeTreatComponent } from './what-we-treat.component';
import { SafePipeModule } from '../../core/pipes/safe-pipe/safe-pipe.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';



@NgModule({
  declarations: [
    WhatWeTreatComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    SafePipeModule,
    ImageLazyLoadModule,
    RouterModule.forChild([{
      path: '',
      component: WhatWeTreatComponent
    }]),
    SharedModule
  ]
})
export class WhatWeTreatModule { }
