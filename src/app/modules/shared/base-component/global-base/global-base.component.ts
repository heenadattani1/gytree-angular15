import { ChangeDetectorRef, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonUtil } from 'src/app/utils/common-util';
import { OUR_TEAM_CONFIG } from 'src/app/web-pages/our-team/our-team.constant';
import { EventTrackingService } from '../../../../shared/services/event-tracking.service';
import { GetDataService } from '../../../../shared/services/get-data.service';
import { CAROUSEL_CONFIG } from '../../constants/carousel-config.constant';
import { NavigateService } from '../../helper-utils/navigate.service';
import { ModalBaseClass } from '../../modals/base_class/modal-base-class';
import { APPOINTMENT_SCHEMA } from '../../models/appointment-list.constant';
import { DOCTOR_DETAILS_SCHEMA } from '../../models/doctor-details.constant';
import { INVOICE_LIST_SCHEMA } from '../../models/invoice-list.constant';
import { PACKAGE_SCHEMA, PACKAGE_SCHEMA1 } from '../../models/package-list.constant';
import { PACKAGE_WISE_ORDER_SCHEMA } from '../../models/package-wise-order-list.constant';
import { PILL_LIST_SCHEMA } from '../../models/pill-list.constant';
import { UNLOCKED_FEATURES_SCHEMA } from '../../models/unlocked-features.constant';
import { DashboardListService } from '../../services/dashboard-list/dashboard-list.service';
import { DoctorsListService } from '../../services/doctors-list/doctors-list.service';
import { InvoiceListService } from '../../services/invoice-list/invoice-list.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { OrderListService } from '../../services/order-list/order-list.service';
import { PackageListService } from '../../services/package-list/package-list.service';
import { PackageWiseOrderListService } from '../../services/package-wise-order-list/package-wise-order-list.service';
import { PrescriptionListService } from '../../services/prescription-list/prescription-list.service';
import { ThyrocareService } from '../../services/thyrocare/thyrocare.service';

@Component({ template: '' })

export abstract class GlobalBaseComponent extends ModalBaseClass {

  userDetails = this.localStorageService.getItem('userSlug');

  // DASHBOARD
  dashboardPackages: PACKAGE_SCHEMA1 = {
    packageData: [],
    carouselOptions: CAROUSEL_CONFIG.carouselOptions
  };
  dashBoardsubscriptions: Subscription[] = [];
  isDashboardPackageWiseOrders = false;
  unlockeDashboarddFeatures: UNLOCKED_FEATURES_SCHEMA[] = [];
  dasboardnotificationDetail: any = {};
  dashboardData = {};

  // SCHEDULE
  schedulepackages: PACKAGE_SCHEMA1 = {
    packageData: [],
    carouselOptions: CAROUSEL_CONFIG.carouselOptions
  };
  schedulesubscriptions: Subscription[] = [];
  scheduleappointmentList: APPOINTMENT_SCHEMA[];
  scheduleselectedAppointment: APPOINTMENT_SCHEMA;
  schedulenotification_data: any;
  scheduleData = {};

  // PRESCRIPTION
  prescriptionpackages: PACKAGE_SCHEMA1 = {
    packageData: [],
    carouselOptions: CAROUSEL_CONFIG.carouselOptions
  };
  prescriptionsubscriptions: Subscription[] = [];
  prescriptionpillList: PILL_LIST_SCHEMA[];
  prescriptionselectedPillList: PILL_LIST_SCHEMA;
  prescriptionnotification_data: any;
  prescriptionData = {};

  // PACKAGES
  packagesubscriptions: Subscription[] = [];
  packageScreenPackages: PACKAGE_SCHEMA1 = {
    packageData: [],
    carouselOptions: CAROUSEL_CONFIG.carouselOptions
  };
  packageScreenSelectedPackage: PACKAGE_WISE_ORDER_SCHEMA;
  packageScreenPackageWiseOrderData: PACKAGE_WISE_ORDER_SCHEMA[];
  packageData = {};

  // BOOK TEST
  labTestsubscriptions: Subscription[] = [];
  bookAnExpertList: any;
  labTestData = {};

  // BOOK EXPERT
  expertsubscriptions: Subscription[] = [];
  doctorType: string[];
  doctorsList: DOCTOR_DETAILS_SCHEMA | any = [];
  doctorData = {};

  // INVOICE
  invoicesubscriptions: Subscription[] = [];
  invoiceList: INVOICE_LIST_SCHEMA[];
  invoiceData = {};

  constructor(
    public modalService: NgbModal,
    public cdr: ChangeDetectorRef,
    public navigateService: NavigateService,
    public dashboardListService: DashboardListService,
    public packagesListService: PackageListService,
    public localStorageService: LocalStorageService,
    public packageWiseOrderListService: PackageWiseOrderListService,
    public titleService: Title,
    public router: Router,
    public orderListService: OrderListService,
    public PrescriptionListService: PrescriptionListService,
    public thyrocareService: ThyrocareService,
    public invoiceListService: InvoiceListService,
    public doctorsListService: DoctorsListService,
    public eventTrackingService: EventTrackingService,
    public GetData: GetDataService) {
    super(modalService);
  }

  // DASHBOARD 
  allDashboardApiCall() {
    this.GetData.storedDashboardData.subscribe(res => {
      if (res === null) {
        this.getDashBoardPackageWiseOrder();
      }
      else {
        this.dashboardPackages = res?.dashboardPackages;
        this.isDashboardPackageWiseOrders = res?.isDashboardPackageWiseOrders;
        this.unlockeDashboarddFeatures = res?.unlockeDashboarddFeatures;
        this.dasboardnotificationDetail = res?.dasboardnotificationDetail || {};
      }
    })
  }

  getDashBoardPackageWiseOrder() {
    const payload = {
      user_slug: this.localStorageService.getItem('userSlug').user_slug
    }
    this.dashBoardsubscriptions.push(this.packageWiseOrderListService.packageWiseOrderList(payload).subscribe((data) => {
      if (data?.success) {
        this.dashboardPackages.packageData = data.data;
        if (data.data?.length < 4) {
          this.dashboardPackages.carouselOptions = OUR_TEAM_CONFIG.list
        }
        data.data?.forEach((element: PACKAGE_SCHEMA) => {
          if (element.gtp_paidconfig?.length) {
            element.gtp_paidconfig.forEach((data: UNLOCKED_FEATURES_SCHEMA) =>
              this.unlockeDashboarddFeatures = [...this.unlockeDashboarddFeatures, data]
            )
          }
        })
        if (!data.data?.length) {
          this.isDashboardPackageWiseOrders = false;
          this.getDashboardPackages();
        } else {
          this.isDashboardPackageWiseOrders = true;
        }
        this.dashboardData = { ...this.dashboardData, dashboardPackages: this.dashboardPackages, unlockeDashboarddFeatures: this.unlockeDashboarddFeatures, isDashboardPackageWiseOrders: this.isDashboardPackageWiseOrders };
        this.GetData.storedDashboardData.next(this.dashboardData);
        this.getDashboardList();
      }
    }));
  }

  /**
   * Method to get the Packages list from api
   */
  getDashboardPackages() {
    this.dashBoardsubscriptions.push(this.packagesListService.getPackagesList().subscribe((data) => {
      if (data?.success) {
        this.dashboardPackages.packageData = data.data.slice(0, 5);
        this.dashboardPackages.carouselOptions = {
          ...CAROUSEL_CONFIG.carouselOptions,
          responsive: {
            0: {
              nav: true,
              dots: false
            },
            400: {
              nav: true,
              dots: false
            },
            740: {
              nav: true,
              dots: false
            },
            1000: {
              nav: true,
              dots: false
            },
            1240: {
              nav: true,
              dots: false
            }
          }
        }
        this.dashboardData = { ...this.dashboardData, dashboardPackages: this.dashboardPackages };
        this.GetData.storedDashboardData.next(this.dashboardData);
        this.cdr.detectChanges();
      }
    }));
  }

  /**
   * Method to get notification list
   */
  getDashboardList() {
    const payload = {
      user_slug: this.localStorageService.getItem('userSlug').user_slug,
      read: 0
    }
    this.dashBoardsubscriptions.push(this.dashboardListService.dashboardList(payload).subscribe((data) => {
      if (data?.success && data.data) {
        const notification = ['prescription', 'appointment', 'reminder'];
        (notification || []).forEach((key: any, index: any) => {
          this.dasboardnotificationDetail[key] = (data.data || []).filter((a: any) => a.gtnf_type.toLowerCase() == key.toLowerCase())
        });

        this.dasboardnotificationDetail.reminder = (this.dasboardnotificationDetail.reminder || []).reduce((unique: any, o: any) => {
          if (!unique.some((obj: any) => obj.gtnf_guid === o.gtnf_guid)) {
            unique.push(o);
          }
          return unique;
        }, []);

        this.removeDashboardDuplicates(this.dasboardnotificationDetail.reminder, 'gtnf_guid');
        this.getDashboardCuurentdateRemider();
        (this.dasboardnotificationDetail.reminder || []).forEach((res: any) => {
          res.gtnf_dscr.gtnf_date = CommonUtil.parseDate(res.gtnf_dscr.gtnf_date, 'IS_GET_TIME')
        })
        this.dashboardData = { ...this.dashboardData, dasboardnotificationDetail: this.dasboardnotificationDetail };
        this.GetData.storedDashboardData.next(this.dashboardData);
        this.cdr.detectChanges();
      }
    }));
  }

  removeDashboardDuplicates = (array: any, key: any) => {
    return array.reduce((arr: any, item: any) => {
      const removed = arr.filter((i: any) => i[key] !== item[key]);
      return [...removed, item];
    }, []);
  };

  getDashboardCuurentdateRemider() {
    let today = new Date().getDate() + new Date().getMonth() + new Date().getFullYear();
    this.dasboardnotificationDetail.reminder = (this.dasboardnotificationDetail.reminder || []).filter((res: any) => today === (new Date(res.gtnf_dscr.gtnf_date).getDate() + new Date(res.gtnf_dscr.gtnf_date).getMonth() + new Date(res.gtnf_dscr.gtnf_date).getFullYear()));
    this.dashboardData = { ...this.dashboardData, dasboardnotificationDetail: this.dasboardnotificationDetail };
    this.GetData.storedDashboardData.next(this.dashboardData);
  }

  // SCHEDULE
  allScheduleApiCall() {
    this.GetData.storedScheduleData.subscribe(res => {
      if (res === null) {
        this.getSchedulePackages();
      }
      else {
        this.schedulepackages = res?.schedulepackages;
        this.scheduleappointmentList = res?.scheduleappointmentList;
        this.scheduleselectedAppointment = res?.scheduleselectedAppointment || {};
      }
    })
  }

  /**
   * Method to get the Packages list from api 
   */
  getSchedulePackages() {
    this.schedulesubscriptions.push(this.packagesListService.getPackagesList().subscribe((data) => {
      if (data?.success) {
        this.schedulepackages.packageData = data.data.slice(0, 5);
        if (this.schedulepackages.packageData?.length < 4) {
          this.schedulepackages.carouselOptions = OUR_TEAM_CONFIG.list
        }
        this.scheduleData = { ...this.scheduleData, schedulepackages: this.schedulepackages };
        this.GetData.storedScheduleData.next(this.scheduleData);
        this.scheduleorderList();
      }
    }));
  }

  /**
   * Method to get the list of orders from api
   */
  scheduleorderList() {
    const payload = {
      user_slug: this.localStorageService.getItem('userSlug').user_slug
    }
    this.schedulesubscriptions.push(this.orderListService.orderList(payload).subscribe((data) => {
      if (data?.success) {
        this.scheduleappointmentList = data.data;
        this.scheduleselectedAppointment = data?.data[0];
        if (this.router.getCurrentNavigation()?.extras.state?.notification) {
          this.scheduleselectedAppointment = this.scheduleappointmentList?.filter(element => element.gto_guid === this.schedulenotification_data.gnf_oid)[0];
          this.scheduleappointmentList = this.scheduleappointmentList?.filter(element => element.gto_guid !== this.schedulenotification_data.gnf_oid);
          this.scheduleappointmentList.splice(0, 0, this.scheduleselectedAppointment);
        }
        this.scheduleData = { ...this.scheduleData, scheduleappointmentList: this.scheduleappointmentList, scheduleselectedAppointment: this.scheduleselectedAppointment };
        this.GetData.storedScheduleData.next(this.scheduleData);
        this.cdr.detectChanges();
      }
    }))
  }

  // PRESCRIPTION
  allPrescriptionApiCall() {
    this.GetData.storedPrescriptionData.subscribe(res => {
      if (res === null) {
        this.getPrescriptionList();
      }
      else {
        this.prescriptionpackages = res?.prescriptionpackages;
        this.prescriptionpillList = res?.prescriptionpillList;
        this.prescriptionselectedPillList = res?.prescriptionselectedPillList || {};
      }
    })
  }

  /**
  * Method to get the Packages list from api 
  */
  getPrescriptionList() {
    const payload = {
      userslug: this.userDetails && this.userDetails.user_slug
    }
    this.prescriptionsubscriptions.push(this.PrescriptionListService.getPrescriptionList(payload).subscribe((res) => {
      if (res?.success) {
        this.prescriptionpillList = res.data.data;
        this.prescriptionselectedPillList = res.data.data[0];
        if (this.router.getCurrentNavigation()?.extras.state?.notification) {
          this.prescriptionselectedPillList = this.prescriptionpillList?.filter(element => element.gtpr_order_id === this.router.getCurrentNavigation()?.extras.state?.notification.gnf_oid)[0];
          this.prescriptionpillList = this.prescriptionpillList?.filter(element => element.gtpr_order_id !== this.router.getCurrentNavigation()?.extras.state?.notification.gnf_oid);
          this.prescriptionpillList.splice(0, 0, this.prescriptionselectedPillList);
        }
        this.prescriptionData = { ...this.prescriptionData, prescriptionpillList: this.prescriptionpillList, prescriptionselectedPillList: this.prescriptionselectedPillList };
        this.GetData.storedPrescriptionData.next(this.prescriptionData);
        this.prescriptionchangePillListdateFormat();
        this.cdr.detectChanges();
      }
    }));
    this.getPrescriptionPackages();
  }

  prescriptionchangePillListdateFormat() {
    (this.prescriptionpillList || []).forEach(res => {
      if (res && res.appointment_data && res.appointment_data.gtap_date) {
        res.appointment_data.gtap_date = CommonUtil.parseDate(res.appointment_data.gtap_date);
      }
    });
    this.prescriptionData = { ...this.prescriptionData, prescriptionpillList: this.prescriptionpillList };
    this.GetData.storedPrescriptionData.next(this.prescriptionData);
    this.prescriptionselectedPillFormat();
  }

  prescriptionselectedPillFormat() {
    if (this.prescriptionselectedPillList && this.prescriptionselectedPillList.appointment_data && this.prescriptionselectedPillList.appointment_data.gtap_date) {
      this.prescriptionselectedPillList.appointment_data.gtap_date = CommonUtil.parseDate(this.prescriptionselectedPillList?.appointment_data?.gtap_date);
    }
    this.prescriptionData = { ...this.prescriptionData, prescriptionselectedPillList: this.prescriptionselectedPillList };
    this.GetData.storedPrescriptionData.next(this.prescriptionData);
  }

  /**
   * Method to get the Packages list from api 
   */
  getPrescriptionPackages() {
    this.prescriptionsubscriptions.push(this.packagesListService.getPackagesList().subscribe((data) => {
      if (data?.success) {
        this.prescriptionpackages.packageData = data.data.slice(0, 5);
        if (this.prescriptionpackages.packageData?.length < 4) {
          this.prescriptionpackages.carouselOptions = OUR_TEAM_CONFIG.list
        }
        this.prescriptionData = { ...this.prescriptionData, prescriptionpackages: this.prescriptionpackages };
        this.GetData.storedPrescriptionData.next(this.prescriptionData);
        this.cdr.detectChanges();
      }
    }));
  }

  // PACKAGE
  allPackageApiCall() {
    this.GetData.storedPackageData.subscribe(res => {
      if (res === null) {
        this.packageGetPackages();
      }
      else {
        this.packageScreenPackages = res?.packageScreenPackages;
        this.packageScreenSelectedPackage = res?.packageScreenSelectedPackage || {};
        this.packageScreenPackageWiseOrderData = res?.packageScreenPackageWiseOrderData;
      }
    })
  }

  /**
   * Method to get the Packages list from api 
   */
  packageGetPackages() {
    this.packagesubscriptions.push(this.packagesListService.getPackagesList().subscribe((data) => {
      if (data?.success) {
        this.packageScreenPackages.packageData = data.data;
        if (data.data?.length < 4) {
          this.packageScreenPackages.carouselOptions = OUR_TEAM_CONFIG.list
        }
        this.packageData = { ...this.packageData, packageScreenPackages: this.packageScreenPackages };
        this.GetData.storedPackageData.next(this.packageData);
        this.packageGetPackageWiseOrder();
      }
    }));
  }

  /**
   * Method to get package wise order list
   */
  packageGetPackageWiseOrder() {
    const payload = {
      user_slug: this.localStorageService.getItem('userSlug').user_slug
    }
    this.packagesubscriptions.push(this.packageWiseOrderListService.packageWiseOrderList(payload).subscribe((data) => {
      if (data?.success) {
        this.packageScreenPackageWiseOrderData = data.data;
        this.packageScreenSelectedPackage = data.data?.length ? data.data[0] : null;
        this.packageData = { ...this.packageData, packageScreenPackageWiseOrderData: this.packageScreenPackageWiseOrderData, packageScreenSelectedPackage: this.packageScreenSelectedPackage };
        this.GetData.storedPackageData.next(this.packageData);
        this.packageChangeDateFormatOfOrderList();
        this.cdr.detectChanges();
      }
    }));
  }

  packageChangeDateFormatOfOrderList() {
    (this.packageScreenSelectedPackage?.orders || []).forEach(res => {
      res.c_date = CommonUtil.parseDate(res.c_date, 'IS_GET_TIME');
      res.gto_date = CommonUtil.parseDate(res.gto_date);
    });
    this.packageData = { ...this.packageData, packageScreenSelectedPackage: this.packageScreenSelectedPackage };
    this.GetData.storedPackageData.next(this.packageData);
  }

  // LAB TEST
  allLabTestApiCall() {
    this.GetData.storedLabTestData.subscribe(res => {
      if (res === null) {
        this.getLabTestList();
      }
      else {
        this.bookAnExpertList = res?.bookAnExpertList;
      }
    })
  }

  /**
   * Method to get the list of Lab Tests from api 
   */
  getLabTestList() {
    this.labTestsubscriptions.push(this.thyrocareService.getTestsList({}).subscribe((data) => {
      if (data?.success) {
        this.bookAnExpertList = data.data?.gt_labs_config;
        this.labTestData = { ...this.labTestData, bookAnExpertList: this.bookAnExpertList };
        this.GetData.storedLabTestData.next(this.labTestData);
        this.cdr.detectChanges();
      }
    }));
  }

  // EXPERT
  allExpertApiCall() {
    this.GetData.storedExpertData.subscribe(res => {
      if (res === null) {
        this.getDoctorsList();
      }
      else {
        this.doctorsList = res?.doctorsList;
        this.doctorType = res?.doctorType;
      }
    })
  }

  /**
   * Method to get the list of doctors from api 
   */
  getDoctorsList() {
    this.expertsubscriptions.push(this.doctorsListService.getdoctors().subscribe((data) => {
      if (data?.success) {
        this.doctorsList = data.data;
        this.doctorType = Object.keys(this.doctorsList);
        this.doctorData = { ...this.doctorData, doctorsList: this.doctorsList, doctorType: this.doctorType };
        this.GetData.storedExpertData.next(this.doctorData);
        this.cdr.detectChanges();
      }
    }));
  }

  // INVOICE
  allInvoiceApiCall() {
    this.GetData.storedInvoiceData.subscribe(res => {
      if (res === null) {
        this.getInvoiceList();
      }
      else {
        this.invoiceList = res?.invoiceList;
      }
    })
  }

  /**
   * Method to get the list of invoices from api
   */
  getInvoiceList() {
    const payload = {
      user_slug: this.localStorageService.getItem('userSlug').user_slug
    }
    this.invoicesubscriptions.push(this.invoiceListService.invoiceList(payload).subscribe((data) => {
      if (data?.success) {
        this.invoiceList = data.data;
        this.invoiceData = { ...this.invoiceData, invoiceList: this.invoiceList };
        this.GetData.storedInvoiceData.next(this.invoiceData);
        this.cdr.detectChanges();
      }
    }))
  }

}
