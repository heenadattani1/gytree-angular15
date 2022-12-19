import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

//Constants
import { FILE_UPLOAD } from '../../modules/shared/constants/file-upload.constant';
import { DATE_FORMAT_CONVERTER_ADD_DAYS, DATE_SCHEMA } from '../../modules/shared/constants/ngbdatepicker-date-format.constant';
import { CONSULT_PAYLOAD, CONSULT_QUESTION_LIST_SCHEMA } from '../../modules/shared/models/consult.constant';
import { DAYS, GET_DAY } from '../../modules/shared/constants/get-day.constant';
import { DOCTOR_DETAILS_SCHEMA } from '../../modules/shared/models/doctor-details.constant';

//Services
import { ConsultListService } from '../../modules/shared/services/consult-list/consult-list.service';
import { DoctorsListService } from '../../modules/shared/services/doctors-list/doctors-list.service';
import { FileUploadService } from '../../modules/shared/services/file-upload/file-upload.service';
import { LocalStorageService } from '../../modules/shared/services/local-storage/local-storage.service';
import { NavigateService } from '../../modules/shared/helper-utils/navigate.service';
import { DoctorSlotAvailabilityService } from '../../modules/shared/services/doctor-slot-availability/doctor-slot-availability.service';
import { OrderInsertionService } from '../../modules/shared/services/order-insertion/order-insertion.service';
import { RazorpayWindowRefService } from '../../modules/shared/services/razorpay-window-ref/razorpay-window-ref.service';
import { TransactionOrderService } from '../../modules/shared/services/transaction-order/transaction-order.service';
import { Title } from '@angular/platform-browser';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DoctorAvailabilityService } from '../../modules/shared/services/doctor-availability/doctor-availability.service';
import { TOASTER_CONSTANTS } from 'src/app/modules/shared/toaster/toaster.constant';
import { ModalBaseClass } from '../../modules/shared/modals/base_class/modal-base-class';
import { DoctorDetailsPopupComponent } from '../doctor-details-popup/doctor-details-popup.component';
import { environment } from 'src/environments/environment';
import { CouponService } from '../../modules/shared/services/coupon/coupon.service';
import { GetDataService } from '../../shared/services/get-data.service';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.scss'],
  providers: [DatePipe]
})
export class ConsultComponent extends ModalBaseClass implements OnInit {

  @HostListener('window:beforeunload')
  canDeactivate() {
    return false;
  }

  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';

  rzp1: any;
  order_id: string;
  mobileScreen: boolean;
  coupon: string = "";
  couponCode: any = null;
  discountAmount = 0;
  promocode: boolean = false;
  userDetails = this.localStorageService.getItem('userSlug');
  transactionDetails: any;

  noSlotAvailable: string;
  currentStep: number = 1;
  currentLevel: number = 0;
  currentSelectedOption: string;
  questionsList: CONSULT_QUESTION_LIST_SCHEMA[];
  currentQuestionsList: CONSULT_QUESTION_LIST_SCHEMA;
  selectedAllLevelValues: any[] = [];
  noSelectedValue: boolean;
  doctorType: string;
  doctorsList: DOCTOR_DETAILS_SCHEMA | any;
  minDate: DATE_SCHEMA = DATE_FORMAT_CONVERTER_ADD_DAYS(this.datePipe, 1);
  maxDate: DATE_SCHEMA = DATE_FORMAT_CONVERTER_ADD_DAYS(this.datePipe, 10);
  markDateAsDisabled: any;

  scheduleAppointmentForm: FormGroup = new FormGroup({});
  informationForm: FormGroup = new FormGroup({
    additionalInfo: new FormControl('')
  })
  chooseSlotSection: boolean = false;
  selectTimeArray: any[];
  chooseSlotArray: any[];
  selectedSlot: any;
  selectedFileName: string | null;
  selectedFileError: string | null;
  selectedFIleUri: any;
  selectedFileURL: any
  informationValues: any;
  IS_LIFESTYLE_COACH: boolean = false;
  selectedDoctorDetails: any

  subscriptions: Subscription[] = [];

  constructor(
    public modalService: NgbModal,
    private zone: NgZone,
    private datePipe: DatePipe,
    private calendar: NgbCalendar,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private couponService: CouponService,
    private activatedRoute: ActivatedRoute,
    private navigateService: NavigateService,
    private windowRef: RazorpayWindowRefService,
    private localStorageService: LocalStorageService,
    private doctorsListService: DoctorsListService,
    private consultListService: ConsultListService,
    private orderInsertionService: OrderInsertionService,
    private transactionOrderService: TransactionOrderService,
    private doctorAvailabilityService: DoctorAvailabilityService,
    private doctorSlotAvailabilityService: DoctorSlotAvailabilityService,
    private fileUploadService: FileUploadService,
    private GetData: GetDataService,
    private titleService: Title) {
    super(modalService)
  }

  /**
   * @payload to get the categories at level 0
   */
  ngOnInit(): void {
    this.titleService.setTitle('Gytree - Consult');
    this.initForm();
    this.screenWidth();
    this.addRazorpayScriptTag();
    this.activatedRoute.queryParamMap
      .subscribe((params: Params) => {
        this.doctorType = params.get('type') || '';
      });
    if (this.doctorType === 'LIFESTYLE COACH') {
      this.getDoctorsList();
      this.IS_LIFESTYLE_COACH = true;
    }
    else {
      let payload: CONSULT_PAYLOAD = { que_level: "0" }
      if (this.doctorType) {
        payload = { que_type: this.doctorType }
        const addZeroLevel = {
          level: "0",
          question: "What do you need help with?",
          answer: [this.doctorType]
        }
        this.selectedAllLevelValues.push(addZeroLevel);
        this.currentLevel = 1;
      }
      this.getQuestions(payload);
    }
    this.subscriptions.push(this.scheduleAppointmentForm.controls['date'].valueChanges.subscribe((x: any) => {
      this.getDateValue(false);
    }));
    this.subscriptions.push(this.scheduleAppointmentForm.controls['time'].valueChanges.subscribe((x: any) => {
      this.getDateValue(true);
    }));
    this.heightAutoBody();
    this.GetData.paymentCompleted = false;
  }

  /**
   * Method to get the screen size
   */
  screenWidth() {
    if (window.innerWidth <= 575) {
      this.mobileScreen = true;
    } else {
      this.mobileScreen = false;
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

  /**
  * Control declaration of contactUsForm
  */
  initForm() {
    this.scheduleAppointmentForm = new FormGroup({
      date: new FormControl(this.minDate, [Validators.required]),
      time: new FormControl('', [Validators.required])
    });
    this.cdr.detectChanges();
  }

  /**
   * Height Auto Body
   */
  heightAutoBody() {
    document.body.classList.add("h-auto");
  }
  /**
   * Method to get the date and day value
   */
  getDateValue(isTime: boolean) {
    let date = this.scheduleAppointmentForm.controls['date'].value;
    let getDay: any = new Date(Date.UTC(date.year, date.month - 1, date.day, 0, 0, 0));
    getDay = GET_DAY[getDay.getDay()];
    if (!isTime) {
      this.getTimeSlots(date, getDay);
    }
    if (isTime) {
      this.selectSlot(date, getDay);
    }
  }

  /**
   * api call to get available time slots
   */
  getTimeSlots(date: any, getDay: any) {
    let payload = {};
    if (this.activatedRoute.snapshot.paramMap.get('slug')) {
      payload = {
        gtd_slug: this.doctorsList.find((element: any) => element.gtd_slug === this.activatedRoute.snapshot.paramMap.get('slug')).gtd_slug,
        user_id: this.userDetails.user_slug,
        date: date.year + '-' + (Number(date.month) < 10 ? "0" + date.month : date.month) + '-' + (Number(date.day) < 10 ? "0" + date.day : date.day),
        day: getDay
      }
    }
    else {
      payload = {
        doctortype: this.doctorType,
        date: date.year + '-' + (Number(date.month) < 10 ? "0" + date.month : date.month) + '-' + (Number(date.day) < 10 ? "0" + date.day : date.day),
        day: getDay
      }
    }
    this.subscriptions.push(this.doctorSlotAvailabilityService.doctorSlotAvailability(payload).subscribe(data => {
      if (data?.success) {
        if (data?.success) {
          this.scheduleAppointmentForm.controls['time'].patchValue('');
          this.chooseSlotSection = false;
          if (!data.data?.message) {
            this.noSlotAvailable = "";
            this.selectTimeArray = data.data;
          } else {
            this.noSlotAvailable = data.data.message;
            this.selectTimeArray = [];
          }
        }
      }
      this.cdr.detectChanges();
    }))
  }

  /**
   * Select a slot
   */
  selectSlot(date: any, getDay: any) {
    let payload = {};
    if (this.activatedRoute.snapshot.paramMap.get('slug'))
      payload = {
        gtd_slug: this.doctorsList.find((element: any) => element.gtd_slug === this.activatedRoute.snapshot.paramMap.get('slug')).gtd_slug,
        user_id: this.userDetails.user_slug,
        date: date.year + '-' + (Number(date.month) < 10 ? "0" + date.month : date.month) + '-' + (Number(date.day) < 10 ? "0" + date.day : date.day),
        day: getDay,
        time: this.scheduleAppointmentForm.controls['time'].value.replaceAll('-', 'to')
      }
    else
      payload = {
        doctortype: this.doctorType,
        date: date.year + '-' + (Number(date.month) < 10 ? "0" + date.month : date.month) + '-' + (Number(date.day) < 10 ? "0" + date.day : date.day),
        day: getDay,
        time: this.scheduleAppointmentForm.controls['time'].value.replaceAll('-', 'to')
      }
    if (this.scheduleAppointmentForm.controls['time'].value !== "") {
      this.subscriptions.push(this.doctorSlotAvailabilityService.doctorSlotAvailability(payload).subscribe(data => {
        if (data?.success) {
          this.chooseSlotSection = true;
          this.chooseSlotArray = data.data;
          this.selectedSlot = this.chooseSlotArray[0];
        }
        this.cdr.detectChanges();
      }))
    }
  }

  /**
  * Submit Click Handler of Select Slot
  */
  selectedSlotHandler(slot: string) {
    this.selectedSlot = slot;
  }

  /**
   * handle the disable option on none
   * @param event option change value event
   */
  questionOptionChange(event: any) {
    if (event.target.checked && event.target.value === 'None')
      this.currentQuestionsList.gtq_options.filter((data) => data.name !== 'None').map((data) => { data.disabeled = true, data.checked = false })
    if (event.target.checked && event.target.value !== 'None')
      this.currentQuestionsList.gtq_options.filter((data) => data.name === 'None').map((data) => data.checked = false);
  }

  /**
   * Method to go to save cureent selection and the next step of questions
   */
  nextStep() {
    if (this.currentStep === 1) {
      if (this.currentQuestionsList?.gtq_option_type === 'single') {
        if (!this.currentSelectedOption) {
          this.noSelectedValue = true;
          return;
        }
        this.selectedAllLevelValues.push({
          level: this.currentQuestionsList.gtq_level,
          question: this.currentQuestionsList.gtq_question,
          answer: [this.currentSelectedOption]
        });
      }

      if (this.currentQuestionsList?.gtq_option_type === 'multiple') {
        if (!this.currentQuestionsList.gtq_options.filter((data: any) => data.checked).length) {
          this.noSelectedValue = true;
          return;
        }
        this.selectedAllLevelValues.push({
          level: this.currentQuestionsList.gtq_level,
          question: this.currentQuestionsList.gtq_question,
          answer: this.currentQuestionsList.gtq_options.filter((data: any) => data.checked).map((data: any) => data.name)
        });
      }
      if (this.currentLevel === 0)
        this.doctorType = this.currentSelectedOption;
      this.currentLevel++;
      this.noSelectedValue = false;
      const payload: CONSULT_PAYLOAD = { que_type: this.currentSelectedOption }
      this.getQuestions(payload);
      return;
    }

    if (this.currentStep === 2) {
      this.informationValues = {
        ...this.informationForm.value,
        file: this.selectedFileURL
      }
      this.scheduleAppointmentForm.controls['date'].patchValue(this.minDate);
      this.currentStep++;
    }
  }

  /**
 * Method to get the questions from api
 * @param payload It will have the value of selected category of questions 
 * It is also managing the @currentLevel and @currentStep also
 */
  getQuestions(payload: CONSULT_PAYLOAD) {
    if (this.currentLevel === 1)
      this.getDoctorsList();
    if (this.currentLevel <= 1) {
      this.subscriptions.push(this.consultListService.getQuestions(payload).subscribe((data) => {
        if (data?.success) {
          if (data && data.data && !data.data.length) {
            this.toastr.error('No question and answer avilable', undefined, { positionClass: 'toast-top-center', closeButton: true, })
          }
          this.questionsList = data?.data;
          this.currentQuestionsList = this.questionsList[0];
          if (this.currentQuestionsList?.gtq_option_type === "multiple")
            this.currentQuestionsList.gtq_options = this.currentQuestionsList.gtq_options.map((data: any) => ({ name: data, checked: false, disabeled: false }));
          this.cdr.detectChanges();
        }
      }));
    }

    if (this.currentLevel > 1) {
      if (this.currentLevel <= this.questionsList.length) {
        this.currentQuestionsList = this.questionsList[this.currentLevel - 1];
        if (this.currentQuestionsList?.gtq_option_type === "multiple")
          this.currentQuestionsList.gtq_options = this.currentQuestionsList.gtq_options.map((data: any) => ({ name: data, checked: false, disabeled: false }));
      }
      else {
        this.currentStep++;
        this.currentLevel = 0;
        this.currentSelectedOption = '';
      }
    }

    this.currentSelectedOption = '';
    this.cdr.detectChanges();
  }

  /**
  * Method to get the list of doctors from api 
  */
  getDoctorsList() {
    this.subscriptions.push(this.doctorsListService.getdoctors().subscribe((data) => {
      if (data?.success) {
        this.doctorsList = data.data[this.doctorType];
        if (this.activatedRoute.snapshot.paramMap.get('slug')) {
          this.getDoctorAvailability({ gtds_id: this.activatedRoute.snapshot.paramMap.get('slug') });
          if (this.IS_LIFESTYLE_COACH) this.getDateValue(false)
          this.selectedDoctorDetails = this.doctorsList.find((element: any) => element.gtd_slug === this.activatedRoute.snapshot.paramMap.get('slug'));
        }
        else {
          this.getDoctorAvailability({ type: this.doctorType });
        }
        this.cdr.detectChanges();
      }
    }));
  }

  /**
   * Method to get the doctor's availability details
   */
  getDoctorAvailability(payload: any) {
    this.subscriptions.push(this.doctorAvailabilityService.doctorAvailability(payload).subscribe((data) => {
      if (data?.success) {
        let daysToShow: any[] = [];
        if (this.activatedRoute.snapshot.paramMap.get('slug')) {
          data.data?.gtds_daytime.forEach((element: any) => {
            DAYS.forEach(ele => {
              if (ele.day === element.gtds_day)
                daysToShow.push(ele.id);
            });
          });
        }
        else {
          data.data.forEach((element: any) => {
            element?.gtds_daytime.forEach((ele: any) => {
              DAYS.forEach(day => {
                if (day.day === ele.gtds_day)
                  daysToShow.push(day.id);
              });
            });
          });
          daysToShow = daysToShow.filter((c, index) => {
            return daysToShow.indexOf(c) === index;
          });
        }
        let i = 0;
        this.markDateAsDisabled = (date: NgbDateStruct) => {
          return daysToShow.includes(this.calendar.getWeekday(new NgbDate(date.year, date.month, date.day))) ? false : true;
        };
      }
    }));
  }

  /**
   * Method to go back to the previous questions
   */
  backStep() {
    if (this.currentStep === 2) {
      this.currentLevel = 0;
      this.selectedAllLevelValues = [];
      this.doctorsList = [];
      let payload: CONSULT_PAYLOAD = { que_level: "0" }
      if (this.doctorType) {
        const addZeroLevel = {
          level: "0",
          question: "What do you need help with?",
          answer: [this.doctorType]
        }
        this.selectedAllLevelValues.push(addZeroLevel);
        payload = { que_type: this.doctorType }
        this.currentLevel = 1;
      }
      this.getQuestions(payload);
    }
    if (this.currentStep === 3) {
      this.chooseSlotSection = false;
      this.scheduleAppointmentForm.controls['time'].patchValue('');
      this.cdr.detectChanges();
    }
    if (this.currentStep <= 3) {
      this.currentStep--;
    }
  }

  /**
   * Method to display the screen to enter Promocode
   */
  addPromo() {
    this.promocode = true;
  }

  /**
   * Method to validate the entered promocode
   */
  validateCouponClick() {
    const payload = {
      user_id: this.userDetails.user_slug,
      coupon: this.coupon,
      coupon_type: "doctor",
      reference_id: this.activatedRoute.snapshot.paramMap.get('slug')
    }
    this.subscriptions.push(this.couponService.couponValidate(payload).subscribe((data) => {
      if (data?.success) {
        this.couponCode = this.coupon;
        if (data?.data?.data?.gtc_discount_type === 'percentage') {
          this.discountAmount = Number(this.selectedDoctorDetails?.gtd_consultation_price) * data?.data?.data?.gtc_discount / 100;
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
   * Method to display the schedule screen
   */
  schedule() {
    if (this.scheduleAppointmentForm.invalid || !this.selectedSlot) {
      this.scheduleAppointmentForm.markAllAsTouched();
      return;
    }
    const date = this.scheduleAppointmentForm.controls['date'].value;
    const payload = {
      gto_doc_id: this.activatedRoute.snapshot.paramMap.get('slug') ? this.activatedRoute.snapshot.paramMap.get('slug') : 'Expert Book',
      gto_date: date.year + '-' + (Number(date.month) < 10 ? "0" + date.month : date.month) + '-' + (Number(date.day) < 10 ? "0" + date.day : date.day),
      gto_time: this.scheduleAppointmentForm.value.time,
      gto_slot: this.selectedSlot?.gtd_slot,
      gto_user_id: this.userDetails.user_slug,
      gto_type: "consultation",
      gto_status: "pending",
      gto_payment_status: "init",
      gto_billing: {},
      gto_config: {
        questions: this.selectedAllLevelValues,
        moreInformation: this.informationValues
      },
      gto_coupon: this.couponCode,
      gto_from: this.activatedRoute.snapshot.paramMap.get('slug') ? 'doctor' : 'expert-consult' + ',' + this.doctorType
    }
    this.subscriptions.push(this.orderInsertionService.orderInsertion(payload).subscribe((data) => {
      if (data?.success) {
        if (!data?.data?.orderid) {
          this.noSlotAvailable = data.data?.message;
          return;
        }
        if (data?.data?.orderid) {
          this.order_id = data.data?.orderid;
          this.razorPay(this.order_id);
          this.cdr.detectChanges();
        }
      }
    }));
  }

  /**
   * razorPay options and popup open
   * @param order_id order_id that we get from api
   */
  razorPay(order_id: string) {
    const name = this.activatedRoute.snapshot.paramMap.get('slug') ? this.doctorsList.find((element: any) => element.gtd_slug === this.activatedRoute.snapshot.paramMap.get('slug'))?.gtd_fullname : 'Expert Book';
    const amount = this.selectedDoctorDetails?.gtd_consultation_price ? this.selectedDoctorDetails?.gtd_consultation_price : (Number(this.selectedSlot?.gtd_base_price) * (100 + 18) / 100).toFixed(0);
    var options: any = {
      key: environment.razorPayUrl,
      amount: (Number((amount - this.discountAmount).toFixed(2)) * 100).toString(),
      name: this.activatedRoute.snapshot.paramMap.get('slug') ? name?.slice(0, 1).toUpperCase() + name?.slice(1).toLowerCase() : 'Expert Book',
      currency: 'INR',
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
      this.transactionInit((amount - this.discountAmount).toFixed(2), response?.razorpay_payment_id, 'success');
    })
    this.rzp1 = new this.windowRef.nativeWindow.Razorpay(options);
    this.rzp1.open();
    this.rzp1.on('payment.failed', (response: any) => {
      this.transactionInit((amount - this.discountAmount).toFixed(2), response?.error?.metadata?.payment_id, 'failed');
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
      }
      this.transactionUpdate(this.transactionDetails.gt_txn_id, status);
    }));
  }

  /**
   * method to call api for updating transaction details 
   */
  transactionUpdate(txn_id: string, status: string) {
    const date = this.scheduleAppointmentForm.controls['date'].value;
    let getDay: any = new Date(Date.UTC(date.year, date.month - 1, date.day, 0, 0, 0));
    getDay = GET_DAY[getDay.getDay()];
    const dateValue = date.year + '-' + (Number(date.month) < 10 ? "0" + date.month : date.month) + '-' + (Number(date.day) < 10 ? "0" + date.day : date.day);
    const descriptionValue = getDay + ', ' + dateValue + ', ' + this.selectedSlot?.gtd_slot;
    const finalPrice = this.selectedDoctorDetails?.gtd_consultation_price ? this.selectedDoctorDetails?.gtd_consultation_price : this.selectedSlot?.gtd_base_price;
    const gstPercentage = 18;
    const payload = {
      gt_txn_id: txn_id,
      gt_txn_oid: this.order_id,
      gt_txn_status: status,
      gtiv_refrence_id: this.activatedRoute.snapshot.paramMap.get('slug') ? this.activatedRoute.snapshot.paramMap.get('slug') : this.selectedSlot?.gtd_slug,
      gtiv_base_price: this.selectedDoctorDetails?.gtd_base_price ? this.selectedDoctorDetails?.gtd_base_price : this.selectedSlot?.gtd_base_price,
      // gtiv_cgst: ((Number(finalPrice) * gstPercentage / (100 + gstPercentage)) / 2).toFixed(2),
      // gtiv_sgst: ((Number(finalPrice) * gstPercentage / (100 + gstPercentage)) / 2).toFixed(2),
      gtiv_details: {
        description: this.activatedRoute.snapshot.paramMap.get('slug') ? this.activatedRoute.snapshot.paramMap.get('slug') : "Health Expert Consultation",
        datetime: descriptionValue,
        GST: gstPercentage + "%",
        discount: Number(this.discountAmount),
        summary: this.selectedDoctorDetails?.gtd_base_price ? this.selectedDoctorDetails?.gtd_base_price : this.selectedSlot?.gtd_base_price,
        // Test_Name: 'Appointment booked with ' + this.activatedRoute.snapshot.paramMap.get('slug') ? this.doctorsList.find((element: any) => element.gtd_slug === this.activatedRoute.snapshot.paramMap.get('slug'))?.gtd_fullname : 'Expert Book',
        // total: finalPrice,
        type: "consultation",
        consult_desc: this.activatedRoute.snapshot.paramMap.get('slug') ? this.doctorsList.find((element: any) => element.gtd_slug === this.activatedRoute.snapshot.paramMap.get('slug'))?.gtd_fullname : 'Expert Book',
        base_price: this.selectedDoctorDetails?.gtd_base_price ? this.selectedDoctorDetails?.gtd_base_price : this.selectedSlot?.gtd_base_price
      }
    };
    this.subscriptions.push(this.transactionOrderService.transactionUpdate(payload).subscribe((data) => {
      if (data?.success && status === 'success') {
        this.zone.run(() => {
          this.GetData.paymentCompleted = true;
          this.navigateService.navigation(['appointment-confirmed'], { state: { transactionDetails: this.transactionDetails, Invoicedata: data.data.Invoicedata, type: this.activatedRoute.snapshot.paramMap.get('slug') ? data.data.type : "consultation , Expert-book" } });
          this.toastr.success(TOASTER_CONSTANTS.CONSULT, undefined, { positionClass: 'toast-top-center', closeButton: true, });
        });
        this.cdr.detectChanges();
      }
    }));
  }

  /**
   * Click Handler to continue and redirect
   * after scheduling the appointment
   */
  continueClickHandler() {
    this.navigateService.navigation(['dashboard']);
  }

  /**
   * Method for redirecting to Doctor's detail screen
   * @param slug doctor slug
   */
  viewDoctorProfile(doctorData: DOCTOR_DETAILS_SCHEMA) {
    const modalRef = this.openPopUp(DoctorDetailsPopupComponent, { doctorData }, {
      centered: true, size: 'lg', keyboard: true, backdrop: 'static'
    });
    modalRef.result.then((data) => {
      if (data && data.message === 'OK') {

      }
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * Click Handler of File Change
   */
  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFileName = null;
      this.selectedFileError = null;
      const file = event.target.files[0];
      if ((file.type === 'application/pdf' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size / 1024 / 1024 < 2) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.selectedFIleUri = reader.result;
        };

        setTimeout(() => {
          const payload = {
            type: FILE_UPLOAD.checkFileUploadType(file),
            file: this.selectedFIleUri || 'b64'
          }
          this.subscriptions.push(this.fileUploadService.uploadFile(payload).subscribe(res => {
            if (res.success) {
              this.selectedFileURL = res.data.uploadResult.Location;
              this.selectedFileName = file.name;
              this.selectedFileError = '';
            }
          }))
        }, 100);
      }
      else {
        if (file.size / 1024 / 1024 > 2 && (file.type === 'application/pdf' || file.type === 'image/png' || file.type === 'image/jpeg'))
          this.selectedFileError = 'Please Upload File smaller than 2MB';
        else
          this.selectedFileError = 'Please Upload PNG/JPEG Image or PDF File';
        this.selectedFileName = null;
      }
    }
  }

  /**
   * Clear subscriptions when component complete the process
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    document.body.classList.remove("h-auto");
  }
}
