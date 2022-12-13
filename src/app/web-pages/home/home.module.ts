import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HomeComponent } from './home.component';
import { SafePipeModule } from '../../core/pipes/safe-pipe/safe-pipe.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    SafePipeModule,
    RouterModule.forChild([{
      path: '',
      component: HomeComponent
    }]),
    SharedModule,
    ImageLazyLoadModule,
    NgOptimizedImage
  ]
})
export class HomeModule { }
