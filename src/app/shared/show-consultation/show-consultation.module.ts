import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowConsultationComponent } from './pages/show-consultation/show-consultation.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ImageLazyLoadModule } from '../image-lazy-load/image-lazy-load.module';



@NgModule({
  declarations: [
    ShowConsultationComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    ImageLazyLoadModule,
  ],
  exports: [
    ShowConsultationComponent
  ]
})
export class ShowConsultationModule { }
