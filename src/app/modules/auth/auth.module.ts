import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { AuthComponent } from './auth.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ProfileSetupComponent } from './components/profile-setup/profile-setup.component';
import { NgOtpInputModule } from 'src/app/shared/ng-otp-input/ng-otp-input.module';
import { NgxIntlTelInputModule } from 'src/app/shared/intl-phn-input/public_api';

@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent,
    ProfileSetupComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InlineSVGModule,
    NgxIntlTelInputModule,
    NgOtpInputModule,
  ],
})
export class AuthModule { }
