import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OUR_APPROACH_SCHEMA } from '../../modules/shared/models/our-approach.constant';
import { OurApproachService } from '../../modules/shared/services/our-approach-details/our-approach.service';
import { Meta, Title } from '@angular/platform-browser';
import { CommonUtil } from 'src/app/utils/common-util';
import { MetaTagsEnum } from '../../shared/constants/meta-tags.enum';
import { MetaTagsService } from '../../modules/shared/services/meta-tags/meta-tags.service';

@Component({
  selector: 'app-our-approach',
  templateUrl: './our-approach.component.html',
  styleUrls: ['./our-approach.component.scss']
})
export class OurApproachComponent implements OnInit, OnDestroy {

  ourApproachDetails: OUR_APPROACH_SCHEMA;
  subscriptions: Subscription[] = [];

  constructor(
    public metaService: Meta,
    private cdr: ChangeDetectorRef,
    private ourApproachService: OurApproachService,
    private metaTagsService: MetaTagsService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.getourApproachDetails();
    this.setMetaTagAndTitle();
  }

  /**
   * Method to get the details of Our Approach from api 
   */
  getourApproachDetails() {
    this.subscriptions.push(this.ourApproachService.getOurApproach().subscribe((data) => {
      if (data?.success) {
        this.ourApproachDetails = data.data;
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
          return ele.meta_type === MetaTagsEnum.OUR_APPROACH
        })
        const data = {
          title: 'Gytree - Our Approach',
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
