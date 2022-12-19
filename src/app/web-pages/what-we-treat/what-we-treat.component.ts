import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CAROUSEL_CONFIG } from '../../modules/shared/constants/carousel-config.constant';
import { PackageListService } from '../../modules/shared/services/package-list/package-list.service';
import { WhatWeTreatService } from '../../modules/shared/services/what-we-treat/what-we-treat.service';
import { Meta, Title } from '@angular/platform-browser';
import { CommonUtil } from 'src/app/utils/common-util';
import { MetaTagsEnum } from '../../shared/constants/meta-tags.enum';
import { MetaTagsService } from '../../modules/shared/services/meta-tags/meta-tags.service';

@Component({
  selector: 'app-what-we-treat',
  templateUrl: './what-we-treat.component.html',
  styleUrls: ['./what-we-treat.component.scss']
})
export class WhatWeTreatComponent implements OnInit, OnDestroy {

  whatWeTreatList: any;
  packageDetails: any;
  subscriptions: Subscription[] = []

  constructor(
    public metaService: Meta,
    private cdr: ChangeDetectorRef,
    private whatWeTreatService: WhatWeTreatService,
    private packageListService: PackageListService,
    private metaTagsService: MetaTagsService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.getWhatWeTreatList();
    this.setMetaTagAndTitle();
    setTimeout(() => {
      window.scroll(0, 0);
    }, 100);
  }

  /**
   * Method to get List of Solving your issues from api 
   */
  getWhatWeTreatList() {
    this.subscriptions.push(this.whatWeTreatService.getWhatWeTreatList().subscribe((data) => {
      if (data?.success) {
        this.whatWeTreatList = data.data;
        this.otherPackagesList()
      }
    }));
  }

  /**
   * Method to get the list of packages 
   */
  otherPackagesList() {
    this.subscriptions.push(this.packageListService.getPackagesList().subscribe(data => {
      if (data?.success) {
        this.packageDetails = {
          packageData: data.data.slice(0, 10),
          carouselOptions: CAROUSEL_CONFIG.carouselOptions
        };
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
          return ele.meta_type === MetaTagsEnum.WHAT_WE_TREAT
        })
        const data = {
          title: 'Gytree - What We Treat',
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
