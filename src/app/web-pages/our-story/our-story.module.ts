import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OurStoryComponent } from './our-story.component';
import { RouterModule } from '@angular/router';
import { SafePipeModule } from '../../core/pipes/safe-pipe/safe-pipe.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ImageLazyLoadModule } from '../../shared/image-lazy-load/image-lazy-load.module';



@NgModule({
  declarations: [
    OurStoryComponent
  ],
  imports: [
    CommonModule,
    SafePipeModule,
    RouterModule.forChild([{
      path: '',
      component: OurStoryComponent
    }]),
    CarouselModule,
    NgOptimizedImage
  ]
})
export class OurStoryModule { }
