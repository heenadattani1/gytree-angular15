import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OurTeamComponent } from './our-team.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';
import { SafePipeModule } from 'src/app/core/pipes/safe-pipe/safe-pipe.module';



@NgModule({
  declarations: [
    OurTeamComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    NgOptimizedImage,
    SafePipeModule,
    RouterModule.forChild([{
      path: '',
      component: OurTeamComponent
    }])
  ]
})
export class OurTeamModule { }
