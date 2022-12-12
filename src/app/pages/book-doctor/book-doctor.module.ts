import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookDoctorComponent } from './book-doctor.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';



@NgModule({
  declarations: [
    BookDoctorComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    RouterModule.forChild([
      {
        path: '',
        component: BookDoctorComponent,
      },
    ]),
    ImageLazyLoadModule,
  ]
})
export class BookDoctorModule { }
