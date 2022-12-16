import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PackagesComponent } from './packages.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from 'src/app/shared/shared.module';
import { SafePipeModule } from 'src/app/core/pipes/safe-pipe/safe-pipe.module';


@NgModule({
  declarations: [
    PackagesComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    SafePipeModule,
    NgOptimizedImage,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: PackagesComponent
    }])
  ]
})
export class PackagesModule { }
