import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BookTestComponent } from './book-test.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [BookTestComponent],
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
    NgOptimizedImage,
    SharedModule,
  ],
})
export class BookTestModule {}
