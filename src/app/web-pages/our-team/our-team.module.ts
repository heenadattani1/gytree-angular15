import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    ImageLazyLoadModule,
    SafePipeModule,
    RouterModule.forChild([{
      path: '',
      component: OurTeamComponent
    }])
  ]
})
export class OurTeamModule { }
