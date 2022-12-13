import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { AuthService as authenticationService } from '../../../shared/services/auth/auth.service';
import { IS_USER_LOGGED_IN } from 'src/app/modules/shared/constants/check-user-login.constant';
import { LocalStorageService } from 'src/app/modules/shared/services/local-storage/local-storage.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { CountryISO, SearchCountryField } from 'src/app/shared/intl-phn-input/public_api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  returnUrl: string;
  isLoading: boolean;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India];
  phoneForm = new FormGroup({
    phone: new FormControl("", [Validators.required]),
    invalidOTP: new FormControl(false),
    isOtpScreen: new FormControl(false),
    otp: new FormControl()
  });

  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    containerClass: 'd-flex',
    inputClass: '',
    inputStyles: {
      'border': 'solid 1px #F25769'
    }
  };

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private authenticationService: authenticationService,
    private loaderService: LoaderService
  ) {
    this.checkIsLoading();
  }

  /**
  * Method to handle isLoading
  */
  checkIsLoading() {
    this.loaderService.isLoading.subscribe(res => {
      if (res) {
        this.isLoading = res;
        return;
      }
      this.isLoading = res;
    });
  }

  ngOnInit(): void {
    if (IS_USER_LOGGED_IN(this.localStorageService))
      this.router.navigate(['/']);
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  /**
   * Method to send OTP to the User's provided Mobile Number 
   */
  sendOtpClickHandler() {
    if (this.phoneForm.invalid)
      return;
    const formVal: any = this.phoneForm.getRawValue();
    const payload = {
      user_mobile_number: formVal.phone.number.replaceAll(' ', '')
    }
    this.subscriptions.push(this.authenticationService.generateOtp(payload).subscribe(data => {
      if (data?.success) {
        this.phoneForm.get('isOtpScreen')?.setValue(true);
      }
      this.cdr.detectChanges();
    }));
  }

  /**
   * Method to check if entered OTP is correct or not
   * Checks if the provided Mobile Number is already registered 
   */
  otpNextClickHandler() {
    const formVal: any = this.phoneForm.getRawValue();
    const payload = {
      user_mobile_number: formVal.phone.number.replace(' ', ''),
      user_otp: formVal.otp
    }
    this.subscriptions.push(this.authenticationService.validateUser(payload).subscribe((data: any) => {
      if (data) {
        if (data && data && data.isexist) {
          this.localStorageService.setItem('userSlug', data?.data);
          this.router.navigate([this.localStorageService.getItem('URL') || '/dashboard']);
        } else if (data.isexist === false) {
          this.router.navigate(['/auth/profile-setup'], { state: { mobileNumber: formVal } });
        } else if (data?.otp === 'invalid') {
          this.phoneForm.get('invalidOTP')?.setValue(true);
          return;
        }
      }
    }, (error: any) => {
      this.phoneForm.get('invalidOTP')?.setValue(true);
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

}
