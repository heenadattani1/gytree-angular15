import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  public storedData = new BehaviorSubject(null);
  public storedBannerData = new BehaviorSubject(null);
  public storedHomeData = new BehaviorSubject(null);
  public storedOurPackagesData = new BehaviorSubject(null);
  public storedBookExpertData = new BehaviorSubject(null);
  public storedBookLabTestData = new BehaviorSubject(null);
  public storedDashboardData = new BehaviorSubject(null);
  public storedScheduleData = new BehaviorSubject(null);
  public storedPrescriptionData = new BehaviorSubject(null);
  public storedPackageData = new BehaviorSubject(null);
  public storedLabTestData = new BehaviorSubject(null);
  public storedExpertData = new BehaviorSubject(null);
  public storedInvoiceData = new BehaviorSubject(null);
  public paymentCompleted = false;
  public trackEventData = false;
  constructor() { }
}
