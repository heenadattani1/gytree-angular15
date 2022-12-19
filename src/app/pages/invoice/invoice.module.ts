import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './invoice.component';
import { RouterModule } from '@angular/router';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';
@NgModule({
  declarations: [
    InvoiceComponent
  ],
  imports: [
    CommonModule,
    ImageLazyLoadModule,
    RouterModule.forChild([{
      path: '',
      component: InvoiceComponent
    }])
  ]
})
export class InvoiceModule { }
