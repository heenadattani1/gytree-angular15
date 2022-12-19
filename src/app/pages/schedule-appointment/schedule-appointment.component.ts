import { ChangeDetectorRef, Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

//Constants
import { DAYS, GET_DAY } from '../../modules/shared/constants/get-day.constant';
import { DATE_FORMAT_CONVERTER_ADD_DAYS, DATE_SCHEMA } from 'src/app/modules/shared/constants/ngbdatepicker-date-format.constant';
import { DOCTOR_DETAILS_SCHEMA } from 'src/app/modules/shared/models/doctor-details.constant';
import { PACKAGE_SCHEMA } from 'src/app/modules/shared/models/package-list.constant';

//Services
import { DoctorsListService } from 'src/app/modules/shared/services/doctors-list/doctors-list.service';
import { LocalStorageService } from 'src/app/modules/shared/services/local-storage/local-storage.service';
import { PackageDetailsService } from 'src/app/modules/shared/services/package-details/package-details.service';
import { NavigateService } from '../../modules/shared/helper-utils/navigate.service';
import { OrderInsertionService } from '../../modules/shared/services/order-insertion/order-insertion.service';
import { RazorpayWindowRefService } from '../../modules/shared/services/razorpay-window-ref/razorpay-window-ref.service';
import { TransactionOrderService } from '../../modules/shared/services/transaction-order/transaction-order.service';
import { DoctorSlotAvailabilityService } from '../../modules/shared/services/doctor-slot-availability/doctor-slot-availability.service';
import { Title } from '@angular/platform-browser';
import { DoctorAvailabilityService } from '../../modules/shared/services/doctor-availability/doctor-availability.service';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TOASTER_CONSTANTS } from 'src/app/modules/shared/toaster/toaster.constant';
import { environment } from 'src/environments/environment';
import { ModalBaseClass } from 'src/app/modules/shared/modals/base_class/modal-base-class';
import { DoctorDetailsPopupComponent } from '../doctor-details-popup/doctor-details-popup.component';
import { FILE_UPLOAD } from '../../modules/shared/constants/file-upload.constant';
import { FileUploadService } from '../../modules/shared/services/file-upload/file-upload.service';
import { GetDataService } from '../../shared/services/get-data.service';

@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.scss'],
  providers: [DatePipe]
})
export class ScheduleAppointmentComponent extends ModalBaseClass implements OnInit, OnDestroy {

  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth();
  }

  @HostListener('window:beforeunload')
  canDeactivate() {
    return false;
  }

  rzp1: any;
  order_id: string;
  mobileScreen: boolean;
  userDetails = this.localStorageService.getItem('userSlug');
  transactionDetails: any;
  markDateAsDisabled: any;

  noSlotAvailable: string;
  minDate: DATE_SCHEMA = DATE_FORMAT_CONVERTER_ADD_DAYS(this.datePipe, 1);
  maxDate: DATE_SCHEMA = DATE_FORMAT_CONVERTER_ADD_DAYS(this.datePipe, 10);
  packageDetails: PACKAGE_SCHEMA;
  scheduleAppointmentForm: FormGroup;
  chooseSlotSection: boolean = false;
  selectTimeArray: any;
  chooseSlotArray: string[];
  selectedSlot: string;

  package_slug: string;
  subscriptions: Subscription[] = [];
  doctorsList: DOCTOR_DETAILS_SCHEMA[];
  currentStep: number = 1;
  informationValues: any;
  informationForm: FormGroup = new FormGroup({
    additionalInfo: new FormControl('')
  })
  selectedFileURL: any
  selectedFileName: string | null;
  selectedFileError: string | null;
  selectedFIleUri: any;

  constructor(
    private zone: NgZone,
    public modalService: NgbModal,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private calendar: NgbCalendar,
    private navigateService: NavigateService,
    private windowRef: RazorpayWindowRefService,
    private fileUploadService: FileUploadService,
    private doctorsListService: DoctorsListService,
    private localStorageService: LocalStorageService,
    private packageDetailsService: PackageDetailsService,
    private orderInsertionService: OrderInsertionService,
    private transactionOrderService: TransactionOrderService,
    private doctorAvailabilityService: DoctorAvailabilityService,
    private doctorSlotAvailabilityService: DoctorSlotAvailabilityService,
    private GetData: GetDataService,
    private titleService: Title) {
    super(modalService)
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
    this.titleService.setTitle('Gytree - Schedule Appointment');
    this.initForm();
    this.screenWidth();
    this.addRazorpayScriptTag();
    this.route.paramMap.subscribe((params: any) => {
      this.package_slug = params.params.slug;
      this.getPackagedetails();
    });
    this.GetData.paymentCompleted = false;
    this.subscriptions.push(this.scheduleAppointmentForm.controls['date'].valueChanges.subscribe((x: any) => {
      this.getDateValue(false);
    }));
    this.subscriptions.push(this.scheduleAppointmentForm.controls['time'].valueChanges.subscribe((x: any) => {
      this.getDateValue(true);
    }));
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
    this.cdr.detectChanges();
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
    const payload = {
      gtp_slug: this.package_slug,
      user_id: this.userDetails.user_slug,
      date: date.year + '-' + (Number(date.month) < 10 ? "0" + date.month : date.month) + '-' + (Number(date.day) < 10 ? "0" + date.day : date.day),
      day: getDay
    }
    this.subscriptions.push(this.doctorSlotAvailabilityService.doctorSlotAvailability(payload).subscribe(data => {
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
      this.cdr.detectChanges();
    }))
  }

  /**
   * Select a slot
   */
  selectSlot(date: any, getDay: any) {
    const payload = {
      gtp_slug: this.package_slug,
      user_id: this.userDetails.user_slug,
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
   * Control declaration of contactUsForm
   */
  initForm() {
    this.scheduleAppointmentForm = new FormGroup({
      date: new FormControl(this.minDate, [Validators.required]),
      time: new FormControl('', [Validators.required])
    })
  }

  /**
   * Method to get the Details of selected Package from api 
   */
  getPackagedetails() {
    this.subscriptions.push(this.packageDetailsService.getPackageDetailsById(this.package_slug).subscribe((data) => {
      if (data?.success) {
        this.packageDetails = data.data;
        this.doctorList();
        this.getDoctorAvailability();
      }
    }));
  }

  /**
   * Method to get the doctor's availability details
   */
  getDoctorAvailability() {
    const payload = {
      gtds_id: this.packageDetails.gt_doc_id
    }
    this.subscriptions.push(this.doctorAvailabilityService.doctorAvailability(payload).subscribe((data) => {
      if (data?.success) {
        let daysToShow: any[] = [];
        data.data.gtds_daytime.forEach((element: any) => {
          DAYS.forEach(ele => {
            if (ele.day === element.gtds_day)
              daysToShow.push(ele.id);
          });
        });
        let i = 0;
        this.markDateAsDisabled = (date: NgbDateStruct) => {
          return daysToShow.includes(this.calendar.getWeekday(new NgbDate(date.year, date.month, date.day))) ? false : true;
        };
      };
    }));
  }

  /**
   * Method to go to save cureent selection and the next step of questions
   */
  nextStep() {
    if (this.currentStep === 1) {
      this.informationValues = {
        ...this.informationForm.value,
        file: this.selectedFileURL
      }
      this.scheduleAppointmentForm.controls['date'].patchValue(this.minDate);
      this.currentStep++;
    }
  }

  /**
   * Method to go back to the previous questions
   */
  backStep() {
    if (this.currentStep === 2) {
      this.chooseSlotSection = false;
      this.scheduleAppointmentForm.controls['time'].patchValue('');
      this.cdr.detectChanges();
    }
    if (this.currentStep <= 2) {
      this.currentStep--;
    }
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
  * Method to get the list Of doctor 
  */
  doctorList() {
    this.subscriptions.push(this.doctorsListService.getdoctors().subscribe((data) => {
      if (data?.success) {
        this.doctorsList = data.data[this.packageDetails.gtp_type]
        this.cdr.detectChanges();
      }
    }));
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
  * Submit Click Handler of Select Slot
  */
  selectedSlotHandler(slot: string) {
    this.selectedSlot = slot;
  }

  /**
   * Click Handler to schedule appointment
   */
  scheduleClickHandler() {
    if (this.scheduleAppointmentForm.invalid || !this.selectedSlot) {
      this.scheduleAppointmentForm.markAllAsTouched();
      return;
    }
    const date = this.scheduleAppointmentForm.value.date;
    const payload = {
      gto_doc_id: this.packageDetails.gt_doc_id,
      gto_pack_id: this.packageDetails.gtp_slug,
      gto_date: date.year + '-' + (Number(date.month) < 10 ? "0" + date.month : date.month) + '-' + (Number(date.day) < 10 ? "0" + date.day : date.day),
      gto_time: this.scheduleAppointmentForm.value.time,
      gto_slot: this.selectedSlot,
      gto_user_id: this.userDetails.user_slug,
      gto_type: "consultation",
      gto_status: "pending",
      gto_payment_status: "init",
      gto_billing: {},
      gto_config: {
        moreInformation: this.informationValues
      },
      gto_from: 'package'
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
    const name = this.packageDetails.gtp_name?.replaceAll('-', ' ');
    var options: any = {
      key: environment.razorPayUrl,
      amount: this.packageDetails.gtp_price + '00',
      name: name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase(),
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
      this.transactionInit(this.packageDetails.gtp_price, response?.razorpay_payment_id, 'success');
    })
    this.rzp1 = new this.windowRef.nativeWindow.Razorpay(options);
    this.rzp1.open();
    this.rzp1.on('payment.failed', (response: any) => {
      this.transactionInit(this.packageDetails.gtp_price, response?.error?.metadata?.payment_id, 'failed');
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
    const descriptionValue = getDay + ', ' + dateValue + ', ' + this.selectedSlot;
    const payload = {
      gt_txn_id: txn_id,
      gt_txn_oid: this.order_id,
      gt_txn_status: status,
      gtiv_refrence_id: this.packageDetails.gtp_slug,
      gtiv_details: {
        description: this.package_slug,
        datetime: descriptionValue,
        GST: "18%",
        summary: this.packageDetails.gtp_base_price,
        Test_Name: 'Package - ' + this.packageDetails.gtp_name,
        total: this.packageDetails.gtp_price,
        type: "consultation",
        base_price: this.packageDetails.gtp_base_price,
        consult_desc: this.packageDetails.gtp_srtdescrn
      }
    }
    this.subscriptions.push(this.transactionOrderService.transactionUpdate(payload).subscribe((data) => {
      if (data?.success && status === 'success') {
        this.zone.run(() => {
      this.GetData.paymentCompleted = true;
          this.navigateService.navigation(['appointment-confirmed'], { state: { transactionDetails: this.transactionDetails, Invoicedata: data.data.Invoicedata, type: data.data.type } });
          this.toastr.success(TOASTER_CONSTANTS.PACKAGE, undefined, { positionClass: 'toast-top-center', closeButton: true, });
        });
        this.cdr.detectChanges();
      }
    }));
  }

  /**
  * Clear subscriptions when component complete the process
  */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
