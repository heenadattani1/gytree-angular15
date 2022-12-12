import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NotificationComponent } from '../notification/notification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SafePipeModule } from '../../core/pipes/safe-pipe/safe-pipe.module';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';

@NgModule({
  declarations: [
    DashboardComponent,
    NotificationComponent],
  imports: [
    CommonModule,
    CarouselModule,
    SafePipeModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    //PdfViewerModule,
    ImageLazyLoadModule,
    SharedModule
  ],
})
export class DashboardModule { }
