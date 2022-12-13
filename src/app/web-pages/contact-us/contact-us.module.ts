import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ContactUsComponent } from './contact-us.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';



@NgModule({
  declarations: [
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
   // ImageLazyLoadModule,
    NgOptimizedImage,
    RouterModule.forChild([{
      path: '',
      component: ContactUsComponent
    }])
  ]
})
export class ContactUsModule { }
