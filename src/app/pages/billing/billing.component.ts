import { DatePipe, Location } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FORM_VALIDATION } from 'src/app/modules/shared/constants/form-validatin.constant';
import { GET_DAY } from 'src/app/modules/shared/constants/get-day.constant';
import { BillingDetailsService } from 'src/app/modules/shared/services/billing-details/billing-details.service';
import { LocalStorageService } from 'src/app/modules/shared/services/local-storage/local-storage.service';
import { ThyrocareService } from 'src/app/modules/shared/services/thyrocare/thyrocare.service';
import { TOASTER_CONSTANTS } from 'src/app/modules/shared/toaster/toaster.constant';
import { environment } from 'src/environments/environment';
import { DATE_FORMAT_CONVERTER_ADD_DAYS, DATE_SCHEMA } from '../../modules/shared/constants/ngbdatepicker-date-format.constant';
import { NavigateService } from '../../modules/shared/helper-utils/navigate.service';
import { CouponService } from '../../modules/shared/services/coupon/coupon.service';
import { OrderInsertionService } from '../../modules/shared/services/order-insertion/order-insertion.service';
import { RazorpayWindowRefService } from '../../modules/shared/services/razorpay-window-ref/razorpay-window-ref.service';
import { TransactionOrderService } from '../../modules/shared/services/transaction-order/transaction-order.service';
import { GetDataService } from '../../shared/services/get-data.service';
import { FORM_CONTROLS_CONSTANT } from './billing.constant';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  providers: [DatePipe]
})
export class BillingComponent implements OnInit {

  rzp1: any;
  order_id: string;
  userDetails: any;
  transactionDetails: any;
  dsaBookingEmail: string;
  billingDetailForm = new FormGroup({});
  billingData: any;
  discountAmount = 0;
  subscriptions: Subscription[] = [];
  minDate: DATE_SCHEMA = DATE_FORMAT_CONVERTER_ADD_DAYS(this.datePipe, 1);
  SlotAvailability: any;
  noSlotAvailabilityMessage: any;
  formControlsConfig = FORM_CONTROLS_CONSTANT;
  couponCode = null

  @HostListener('window:beforeunload', ['$event'])
  showMessage($event: any) {
    return false;
  }

  constructor(
    private zone: NgZone,
    private router: Router,
    private location: Location,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private couponService: CouponService,
    private navigateService: NavigateService,
    private windowRef: RazorpayWindowRefService,
    private localStorageService: LocalStorageService,
    private orderInsertionService: OrderInsertionService,
    private billingDetailsService: BillingDetailsService,
    private transactionOrderService: TransactionOrderService,
    private thyrocareService: ThyrocareService,
    private GetData: GetDataService,
    private titleService: Title) {
    this.billingData = this.router.getCurrentNavigation()?.extras.state;
    if (!this.billingData) {
      this.GetData.paymentCompleted = true;
      this.location.back();
    }
  }
  /**
  * Method to add razorpay script lazy loaded
  */
  addRazorpayScriptTag() {
    var script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }

  ngOnInit(): void {
    this.titleService.setTitle('Gytree - Billing');
    this.initForm();
    this.addRazorpayScriptTag();
    this.userDetails = this.localStorageService.getItem('userSlug');
    if (this.billingData) {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setMonth(date.getMonth() + 1);
      let day: string | number = date.getDate();
      let month: string | number = date.getMonth();
      if (date.getMonth() < 10) {
        month = "0" + date.getMonth();
      }
      if (date.getDate() < 10) {
        day = "0" + date.getDate();
      }
      const todayDate = date.getFullYear() + '-' + month + '-' + day;
      const payload = {
        Pincode: this.billingData.pincodeFilterData.pincode,
        Date: todayDate,
      }
      this.patchFormValues();
      this.getSlotList(payload);
    }
    this.billingDetailForm.get('selectDate')?.valueChanges.subscribe((date) => {
      const payload = {
        Pincode: this.billingData.pincodeFilterData.pincode,
        Date: date.year + '-' + (Number(date.month) < 10 ? "0" + date.month : date.month) + '-' + (Number(date.day) < 10 ? "0" + date.day : date.day)
      }
      this.getSlotList(payload);
    })
    if (this.billingData) {
      this.GetData.paymentCompleted = false;
    }
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
 * Method to validate ZERO(0) at start
 * @param event event
 */
  phoneNumberRemoveZero(event: any) {
    if (event.target.value.startsWith('0')) {
      this.billingDetailForm.get('phoneNumber')?.setValue(event.target.value.slice(1));
      this.billingDetailForm.get('phoneNumber')?.updateValueAndValidity();
    }
  }

  /**
   * Method to get Slot List
   */
  getSlotList(payload: any) {
    this.thyrocareService.getSlotAvailability(payload).subscribe(res => {
      if (res.success) {
        if (res.data.response === 'Success') {
          this.noSlotAvailabilityMessage = '';
          this.SlotAvailability = res.data.lSlotDataRes;
          this.billingDetailForm.get('selectTime')?.setValidators([Validators.required]);
          this.billingDetailForm.get('selectTime')?.updateValueAndValidity();
          this.billingDetailForm.get('selectTime')?.setValue(this.SlotAvailability[0].slot);
        }
        else {
          this.noSlotAvailabilityMessage = res.data.response;
          this.SlotAvailability = null;
          this.billingDetailForm.get('selectTime')?.clearValidators();
          this.billingDetailForm.get('selectTime')?.updateValueAndValidity();
          this.billingDetailForm.get('selectTime')?.setValue('');
        }
        this.cdr.detectChanges();
      }
    })
  }

  /**
   * Method to patch Form Values
   */
  patchFormValues() {
    this.billingDetailForm.controls['pincode'].patchValue(Number(this.billingData.pincodeFilterData.pincode));
  }

  /**
   * Billing form declaration and controls added
   */
  initForm() {
    this.billingDetailForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(FORM_VALIDATION.MOBILE_PATTERN)]),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(FORM_VALIDATION.EMAIL_PATTERN)])),
      age: new FormControl('', [Validators.required]),
      pincode: new FormControl({ value: '', disabled: true }, [Validators.required]),
      houseorflat: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      landMark: new FormControl('', [Validators.required]),
      selectDate: new FormControl(this.minDate, [Validators.required]),
      selectTime: new FormControl(this.SlotAvailability ? this.SlotAvailability[0] : '', [Validators.required]),
      additionalInformation: new FormControl('', []),
      promocode: new FormControl('', [])
    });
  }

  /**
   * Method to validate the entered promocode
   */
  validateCouponClick() {
    const payload = {
      user_id: this.userDetails.user_slug,
      coupon: this.billingDetailForm.controls['promocode'].value,
      coupon_type: "labtest",
      reference_id: "thyrocare-e2b5e27d-784c-4c48-a24b-a915ba77742a"
    }
    this.subscriptions.push(this.couponService.couponValidate(payload).subscribe((data) => {
      if (data?.success) {
        this.couponCode = this.billingDetailForm.controls['promocode'].value;
        if (data?.data?.data?.gtc_discount_type === 'percentage') {
          this.discountAmount = Number(this.billingData.labTest.rate.offerRate) * data?.data?.data?.gtc_discount / 100;
          this.discountAmount = Number(this.discountAmount.toFixed(2));
        } else {
          this.discountAmount = data?.data?.data?.gtc_discount;
        }
      } else {
        this.discountAmount = 0;
      }
      this.cdr.detectChanges();
    }));
  }

  /**
   * Method to submit Billing form data
   */
  submitBillingDetailForm() {
    if (this.billingDetailForm.invalid || this.noSlotAvailabilityMessage !== '') {
      this.billingDetailForm.markAllAsTouched();
      return;
    }
    const date = this.billingDetailForm.controls['selectDate'].value;
    const payload = {
      gto_lab_id: "thyrocare-e2b5e27d-784c-4c48-a24b-a915ba77742a",
      gto_date: date.year + '-' + (Number(date.month) < 10 ? "0" + date.month : date.month) + '-' + (Number(date.day) < 10 ? "0" + date.day : date.day),
      gto_time: this.billingDetailForm.controls['selectTime'].value,
      gto_user_id: this.userDetails.user_slug,
      gto_type: "lab_test",
      gto_status: "pending",
      gto_payment_status: "init",
      gto_billing: {
        gtbd_user_slug: this.userDetails.user_slug,
        gtbd_sc_config: this.billingDetailForm.controls['additionalInformation'].value,
        gtbd_sc_date: date.year + '-' + (Number(date.month) < 10 ? "0" + date.month : date.month) + '-' + (Number(date.day) < 10 ? "0" + date.day : date.day),
        gtbd_sc_time: this.billingDetailForm.controls['selectTime'].value,
        gtbd_user_adrs: this.billingDetailForm.controls['houseorflat'].value + ',' + this.billingDetailForm.controls['address'].value + ',' + this.billingDetailForm.controls['landMark'].value,
        gtbd_user_pincode: this.billingData.pincodeFilterData.pincode,
        gtbd_user_email: this.billingDetailForm.controls['email'].value,
        gtbd_user_fname: this.billingDetailForm.controls['firstName'].value,
        gtbd_user_lname: this.billingDetailForm.controls['lastName'].value,
        gtbd_user_mo_no: this.billingDetailForm.controls['phoneNumber'].value,
      },
      gto_coupon: this.couponCode,
      gto_from: 'thyrocare'
    }
    this.subscriptions.push(this.orderInsertionService.orderInsertion(payload).subscribe((data) => {
      if (data?.success) {
        this.order_id = data.data?.orderid;
        this.razorPay(this.order_id);
        this.cdr.detectChanges();
      }
    }));
  }

  /**
   * razorPay options and popup open
   * @param order_id order_id that we get from api
   */
  razorPay(order_id: string) {
    var options: any = {
      key: environment.razorPayUrl,
      amount: (Number((this.billingData.labTest.rate.offerRate - this.discountAmount).toFixed(2)) * 100).toString(),
      currency: 'INR',
      name: this.billingData.labTest.name,
      id: order_id,
      modal: {
        escape: false,
      },
      notes: {
      },
      prefill: {
        name: this.userDetails.user_name,
        email: this.userDetails.user_email,
        contact: this.userDetails.user_mobile_number
      },
    };
    options.handler = ((response: any) => {
      options.response = response;
      this.transactionInit((Number(this.billingData.labTest.rate.offerRate) - this.discountAmount).toFixed(2), response?.razorpay_payment_id, 'success');
    })
    this.rzp1 = new this.windowRef.nativeWindow.Razorpay(options);
    this.rzp1.open();
    this.rzp1.on('payment.failed', (response: any) => {
      this.transactionInit((Number(this.billingData.labTest.rate.offerRate) - this.discountAmount).toFixed(2), response?.error?.metadata?.payment_id, 'failed');
    });
  }

  /**
   * method to call api for initiating transaction 
   */
  transactionInit(price: any, raz_pay_id: any, status: string) {
    const payload = {
      user_id: this.userDetails.user_slug,
      gt_txn_oid: this.order_id,
      amount: price,
      gt_txn_raz_payid: raz_pay_id,
      razorpay_status: status
    };
    this.subscriptions.push(this.transactionOrderService.transactionInit(payload).subscribe((data) => {
      if (data?.success) {
        this.transactionDetails = data.data;
        if (status === 'success') {
          const date = this.billingDetailForm.controls['selectDate'].value;
          if ((typeof (date.month) === 'number' && date.month < 10) || (typeof (date.month) === 'string' && date.month?.length === 1)) {
            date.month = "0" + date.month;
          }
          if ((typeof (date.day) === 'number' && date.day < 10) || (typeof (date.day) === 'string' && date.day?.length === 1)) {
            date.day = "0" + date.day;
          }
          const payload = {
            gt_order_guid: this.order_id,
            Email: this.billingDetailForm.controls['email'].value,
            Gender: "female",
            Mobile: this.billingDetailForm.controls['phoneNumber'].value,
            Address: this.billingDetailForm.controls['houseorflat'].value + ',' + this.billingDetailForm.controls['address'].value + ',' + this.billingDetailForm.controls['landMark'].value + ',' + this.billingDetailForm.controls['pincode'].value,
            ApptDate: date.year + '-' + date.month + '-' + date.day + " " + this.billingDetailForm.controls['selectTime'].value.split('-')[0].trim(),
            Margin: this.billingData.labTest.margin,
            OrderBy: this.billingDetailForm.controls['firstName'].value + " " + this.billingDetailForm.controls['lastName'].value,
            Passon: 0,
            PayType: "PREPAID",
            PhoneNo: "",
            Pincode: this.billingData.pincodeFilterData.pincode,
            Product: this.billingData.labTest.testNames ? this.billingData.labTest.testNames : this.billingData.labTest.name,
            Rate: Number(this.billingData.labTest.rate.offerRate),
            ReportCode: this.billingData.labTest.code,
            // RefCode: "9004844180",
            Remarks: this.billingDetailForm.controls['additionalInformation'].value,
            Reports: "N",
            ServiceType: "H",
            testName: this.billingData.labTest.name,
            BenCount: "1",
            BenDataXML: "<NewDataSet><Ben_details><Name>" + this.billingDetailForm.controls['firstName'].value + " " + this.billingDetailForm.controls['lastName'].value + "</Name><Age>" + this.billingDetailForm.controls['age'].value + "</Age><Gender>F</Gender></Ben_details></NewDataSet>"
          }
          this.subscriptions.push(this.thyrocareService.booking(payload).subscribe((data) => {
            if (data?.success) {
              if (data.data[0].respId === 'RES02012') {
                this.dsaBookingEmail = data.data[0].email;
                this.transactionUpdate(this.transactionDetails.gt_txn_id, status, data.data[0]);
              }
            }
          }));
        }
      }
    }));
  }

  /**
   * method to call api for updating transaction details 
   */
  transactionUpdate(txn_id: string, status: string, bookingres: any) {
    const date = this.billingDetailForm.controls['selectDate'].value;
    let getDay: any = new Date(Date.UTC(date.year, date.month - 1, date.day, 0, 0, 0));
    getDay = GET_DAY[getDay.getDay()];
    const dateValue = date.year + '-' + (Number(date.month) < 10 ? "0" + date.month : date.month) + '-' + (Number(date.day) < 10 ? "0" + date.day : date.day);
    const descriptionValue = getDay + ', ' + dateValue + ', ' + this.billingDetailForm.controls['selectTime'].value;
    const payload = {
      gt_txn_id: txn_id,
      gt_txn_oid: this.order_id,
      gt_txn_status: status,
      gtiv_refrence_id: bookingres.orderNo + '_' + bookingres.refOrderId,
      type: "thyrocare",
      lab_test_date: this.transactionDetails.gto_billing.gtbd_sc_date,
      lab_test_time: this.transactionDetails.gto_billing.gtbd_sc_time,
      thyrocare_email: this.dsaBookingEmail,
      gtiv_details: {
        description: this.billingData.labTest.description,
        GST: "18%",
        datetime: descriptionValue,
        discount: Number(this.discountAmount),
        summary: this.billingData?.labTest?.rate?.offerRate,
        Test_Name: this.billingData.labTest.name ? this.billingData.labTest.name : '',
        More_Information: this.billingData.labTest.testNames ? this.billingData.labTest.testNames : '',
        total: this.billingData?.labTest?.rate?.offerRate,
        consult_desc: this.billingData.labTest.description
      },
    };
    this.subscriptions.push(this.transactionOrderService.transactionUpdate(payload).subscribe((data) => {
      if (data?.success && status === 'success') {
        this.zone.run(() => {
          this.GetData.paymentCompleted = true;
          this.navigateService.navigation(['appointment-confirmed'], { state: { transactionDetails: this.transactionDetails, Invoicedata: data.data.Invoicedata, type: data.data.type } });
          this.toastr.success(TOASTER_CONSTANTS.LAB_TEST, undefined, { positionClass: 'toast-top-center', closeButton: true, });
        });
      }
      this.cdr.detectChanges();
    }));
  }

  /**
   * Clear subscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
