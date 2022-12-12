import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService as authenticationService } from '../../../shared/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FORM_VALIDATION } from 'src/app/modules/shared/constants/form-validatin.constant';
import { LocalStorageService } from 'src/app/modules/shared/services/local-storage/local-storage.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-profile-setup',
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.scss']
})
export class ProfileSetupComponent implements OnInit {

  hasError: boolean;
  returnUrl: string;
  isLoading: boolean
  subscriptions: Subscription[] = [];
  mobileNumber: any;

  setupProfileForm = new FormGroup({
    userName: new FormControl("", Validators.required),
    age: new FormControl("", Validators.required),
    height: new FormControl("", Validators.required),
    weight: new FormControl("", Validators.required),
    email: new FormControl("", Validators.compose([Validators.required, Validators.pattern(FORM_VALIDATION.EMAIL_PATTERN)])),
    consult: new FormControl(true),
  })

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private loaderService: LoaderService,
    private authenticationService: authenticationService) {
    this.mobileNumber = this.router.getCurrentNavigation()?.extras.state?.mobileNumber?.phone;
    
    if (!this.mobileNumber) {
      this.router.navigate(['/auth/login']);
    }
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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  /**
   * Method to validate max digits allowed in an input
   * @param maxDigits max digits allowed
   * @param event event
   */
   numberValidation(maxDigits: number, event: any) {
    if (event.key == 0 && event.target.value.toString().length === 0) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!maxDigits)
      return;
    if (event.target.value.toString().length > maxDigits - 1 && maxDigits) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * Click handler to register user 
   */
  profileSetupNextClickHandler() {
    if (this.setupProfileForm.invalid)
      return;
    const payload = {
      user_mobile_number: this.mobileNumber.e164Number.replace(this.mobileNumber.dialCode, ''),
      user_email: this.setupProfileForm.controls['email'].value,
      user_name: this.setupProfileForm.controls['userName'].value,
      user_age: (this.setupProfileForm.controls['age'].value).toString(),
      user_height: this.setupProfileForm.controls['height'].value + 'cm',
      user_weight: this.setupProfileForm.controls['weight'].value + 'kg',
      user_wp_no: this.setupProfileForm.controls['consult'].value ? 'yes' : 'no',
    }
    this.subscriptions.push(this.authenticationService.registerUser(payload).subscribe((data) => {
      if (data) {
        this.localStorageService.setItem('userSlug', data.data);
        this.router.navigate([this.localStorageService.getItem('URL') || '/dashboard']);
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

}
