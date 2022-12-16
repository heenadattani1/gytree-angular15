import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FaqComponent } from './faq.component';
import { RouterModule } from '@angular/router';
import { SafePipeModule } from '../../core/pipes/safe-pipe/safe-pipe.module';

@NgModule({
  declarations: [
    FaqComponent
  ],
  imports: [
    CommonModule,
    SafePipeModule,
    NgOptimizedImage,
    RouterModule.forChild([{
      path: '',
      component: FaqComponent
    }])
  ]
})
export class FaqModule { }
