import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NavigateService } from '../../modules/shared/helper-utils/navigate.service';
import { PincodeFilterService } from '../../modules/shared/services/pincode-filter/pincode-filter.service';
import { ThyrocareService } from '../../modules/shared/services/thyrocare/thyrocare.service';

@Component({
  selector: 'app-area-code',
  templateUrl: './area-code.component.html',
  styleUrls: ['./area-code.component.scss'],
})
export class AreaCodeComponent implements OnInit, OnDestroy {
  labTest: any;
  enableContinue = false;
  isCheckClicked = false;
  pincodeFilterData;
  subscriptions: Subscription[] = [];
  pinCodeLength = 6;
  areaPincodeForm = new FormGroup({
    pincode: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });

  constructor(
    public modal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private navigateService: NavigateService,
    private thyrocareService: ThyrocareService,
    private pincodeFilterService: PincodeFilterService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.areaPincodeForm.valueChanges.subscribe(() => {
      this.disableContinue();
    });
  }

  /**
   * Method to filter data Pincode wise
   */
  pinCodeWiseFilter() {
    if (this.areaPincodeForm.invalid) return;
    const payload = {
      Pincode: this.areaPincodeForm.controls['pincode'].value.toString(),
    };
    this.subscriptions.push(
      this.thyrocareService.verifyPincode(payload).subscribe((data) => {
        if (data?.success) {
          if (data?.data?.status === 'Y') {
            this.isCheckClicked = false;
            this.pincodeFilterData = this.areaPincodeForm.value;
            this.enableContinue = true;
          }
          if (data?.data?.status === 'N') this.isCheckClicked = true;
          this.cdr.detectChanges();
        }
      })
    );
  }

  /**
   * Method to disable continue button
   */
  disableContinue() {
    this.enableContinue = false;
  }

  /**
   * Continue click handler
   * Redirects to billing screen
   */
  continue() {
    if (this.areaPincodeForm.invalid) return;
    this.modal.close('Ok click');
    this.navigateService.navigation(['/billing'], {
      state: {
        labTest: this.labTest,
        pincodeFilterData: this.pincodeFilterData,
      },
    });
  }

  /**
   * Clear subscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
