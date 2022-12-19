import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PackageComponent } from './package.component';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    PackageComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    RouterModule.forChild([
      {
        path: '',
        component: PackageComponent,
      },
    ]),
    InlineSVGModule,
    NgOptimizedImage,
    SharedModule
  ]
})
export class PackageModule { }
