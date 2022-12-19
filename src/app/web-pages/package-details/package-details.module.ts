import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PackageDetailsComponent } from './package-details.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { SafePipeModule } from '../../core/pipes/safe-pipe/safe-pipe.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';
@NgModule({
  declarations: [
    PackageDetailsComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    NgxGalleryModule,
    SafePipeModule,
    SharedModule,
    ImageLazyLoadModule,
    NgOptimizedImage,
    RouterModule.forChild([{
      path: '',
      component: PackageDetailsComponent
    }])
  ]
})
export class PackageDetailsModule { }
