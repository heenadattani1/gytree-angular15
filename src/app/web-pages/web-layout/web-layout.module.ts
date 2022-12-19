import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { WebLayoutComponent } from './web-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { Routing } from '../routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: WebLayoutComponent,
    children: Routing,
  },
];
@NgModule({
  declarations: [
    WebLayoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgOptimizedImage,
    NgbTooltipModule,
    RouterModule.forChild(routes),
  ]
})
export class WebLayoutModule { }
