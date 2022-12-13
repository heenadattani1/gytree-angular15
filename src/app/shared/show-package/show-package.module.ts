import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ShowPackagesComponent } from './pages/show-packages/show-packages.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    ShowPackagesComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    NgOptimizedImage
  ],
  exports: [ShowPackagesComponent]
})
export class ShowPackageModule { }
