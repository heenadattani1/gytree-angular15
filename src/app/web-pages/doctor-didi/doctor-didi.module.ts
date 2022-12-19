import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorDidiComponent } from './doctor-didi.component';
import { SafePipeModule } from '../../core/pipes/safe-pipe/safe-pipe.module';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    DoctorDidiComponent
  ],
  imports: [
    CommonModule,
    SafePipeModule,
    RouterModule.forChild([{
      path: '',
      component: DoctorDidiComponent
    }])
  ]
})
export class DoctorDidiModule { }
