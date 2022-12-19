import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ConsultComponent } from './consult.component';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';
import { DoctorDetailsPopupComponent } from '../doctor-details-popup/doctor-details-popup.component';
import { SafePipeModule } from '../../core/pipes/safe-pipe/safe-pipe.module';
@NgModule({
  declarations: [
    ConsultComponent,
    DoctorDetailsPopupComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ConsultComponent,
      },
    ]),
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    ImageLazyLoadModule,
    NgbDatepickerModule,
    SafePipeModule,
  ]
})
export class ConsultModule { }
