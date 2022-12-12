import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FounderComponent } from './founder.component';
import { RouterModule } from '@angular/router';
import { ImageLazyLoadModule } from '../../shared/image-lazy-load/image-lazy-load.module';



@NgModule({
  declarations: [
    FounderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: FounderComponent
    }]),
    ImageLazyLoadModule
  ]
})
export class FounderModule { }
