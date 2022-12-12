import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowPackagesComponent } from './pages/show-packages/show-packages.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    ShowPackagesComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
  ],
  exports: [ShowPackagesComponent]
})
export class ShowPackageModule { }
