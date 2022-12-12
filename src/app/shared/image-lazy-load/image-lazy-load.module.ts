import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyImgDirective } from './lazy-load.directive';
import { ImagePreloader } from './img-preloader.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [LazyImgDirective, ImagePreloader],
  exports: [LazyImgDirective, ImagePreloader]
})
export class ImageLazyLoadModule { }
