import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DoctorDidiService } from '../../modules/shared/services/doctor-didi/doctor-didi.service';
import { Meta, Title } from '@angular/platform-browser';
import { CommonUtil } from 'src/app/utils/common-util';
import { MetaTagsEnum } from '../../shared/constants/meta-tags.enum';
import { MetaTagsService } from '../../modules/shared/services/meta-tags/meta-tags.service';

@Component({
  selector: 'app-doctor-didi',
  templateUrl: './doctor-didi.component.html',
  styleUrls: ['./doctor-didi.component.scss']
})
export class DoctorDidiComponent implements OnInit, OnDestroy {

  doctorDidi: any;
  subscriptions: Subscription[] = []

  constructor(
    public metaService: Meta,
    private cdr: ChangeDetectorRef,
    private doctorDidiService: DoctorDidiService,
    private metaTagsService: MetaTagsService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.getDoctorDidiDetails();
    this.setMetaTagAndTitle();
  }

  /**
   * Method to get Terms and Conditions from api 
   */
  getDoctorDidiDetails() {
    this.subscriptions.push(this.doctorDidiService.getdoctorDidiDetails().subscribe((data) => {
      if (data?.success) {
        this.doctorDidi = data.data;
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

  /**
   * Meta tag and title
   */
  setMetaTagAndTitle() {
    this.metaTagsService?.metaTags.subscribe(res => {
      if (res) {
        let metaData = res.filter(ele => {
          return ele.meta_type === MetaTagsEnum.DOCTOR_DIDI
        })
        const data = {
          title: 'Gytree - Doctor Didi',
          metaTitle: metaData[0]?.gmt_title,
          metaDescription: metaData[0]?.gmt_desc,
          metaKeyword: metaData[0]?.gmt_keywords,
          metaImage: metaData[0]?.gmt_image,
        }
        CommonUtil.setMetaTagAndTitle(this.titleService, this.metaService, data)
      }
    })
  }
}
