import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from './billing.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MaskInputDirective } from '../../modules/shared/directives/maskinput.directive';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';



@NgModule({
  declarations: [BillingComponent, MaskInputDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    RouterModule.forChild([
      {
        path: '',
        component: BillingComponent,
      },
    ]),
    SharedModule,
    ImageLazyLoadModule,
  ]
})
export class BillingModule { }
