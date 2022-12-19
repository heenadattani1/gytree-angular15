import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FAQ_LIST_SCHEMA } from '../../modules/shared/models/faq-list.constant';
import { FaqListService } from '../../modules/shared/services/faq-list/faq-list.service';
import { Meta, Title } from '@angular/platform-browser';
import { CommonUtil } from 'src/app/utils/common-util';
import { MetaTagsEnum } from '../../shared/constants/meta-tags.enum';
import { MetaTagsService } from '../../modules/shared/services/meta-tags/meta-tags.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {

  faqList: FAQ_LIST_SCHEMA[];
  subscriptions: Subscription[] = []

  constructor(
    public metaService: Meta,
    private cdr: ChangeDetectorRef,
    private faqListService: FaqListService,
    private metaTagsService: MetaTagsService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.getFaqList();
    this.setMetaTagAndTitle();
  }

  /**
   * Method to get List of FAQs from api 
   */
  getFaqList() {
    this.subscriptions.push(this.faqListService.getFaqList().subscribe((data) => {
      if (data?.success) {
        this.faqList = data.data;
        this.faqList.sort((a: any, b: any) => {
          return a.gtf_id - b.gtf_id;
        })
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
          return ele.meta_type === MetaTagsEnum.FAQS
        })
        const data = {
          title: 'Gytree - FAQs',
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
