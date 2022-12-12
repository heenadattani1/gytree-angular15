import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookTestComponent } from './book-test.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';



@NgModule({
  declarations: [
    BookTestComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BookTestComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    ImageLazyLoadModule,
    SharedModule
  ]
})
export class BookTestModule { }
