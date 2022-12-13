import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PackagesComponent } from './packages.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from 'src/app/shared/shared.module';
import { SafePipeModule } from 'src/app/core/pipes/safe-pipe/safe-pipe.module';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';



@NgModule({
  declarations: [
    PackagesComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    SafePipeModule,
    ImageLazyLoadModule,
    NgOptimizedImage,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: PackagesComponent
    }])
  ]
})
export class PackagesModule { }
