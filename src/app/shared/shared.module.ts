import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowPackageModule } from './show-package/show-package.module';
import { FormValidationTemplateModule } from './form-validation-template/form-validation-template.module';
import { ShowConsultationModule } from './show-consultation/show-consultation.module';
import { YoutubeDirectiveDirective } from './directive/youtube-directive.directive';
import { ClickOutsideDirective } from './directive/outside-click.directive';
import { NumberDirective } from './directive/number-only.directive';


@NgModule({
  declarations: [
    YoutubeDirectiveDirective,
    ClickOutsideDirective,
    NumberDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NumberDirective,
    ShowPackageModule,
    ShowConsultationModule,
    FormValidationTemplateModule,
    YoutubeDirectiveDirective,
    ClickOutsideDirective
  ]
})
export class SharedModule { }
