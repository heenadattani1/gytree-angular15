import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OurApproachComponent } from './our-approach.component';
import { RouterModule } from '@angular/router';
import { SafePipeModule } from '../../core/pipes/safe-pipe/safe-pipe.module';
@NgModule({
  declarations: [
    OurApproachComponent
  ],
  imports: [
    CommonModule,
    SafePipeModule,
    RouterModule.forChild([{
      path: '',
      component: OurApproachComponent
    }])
  ]
})
export class OurApproachModule { }
