import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CommonUtil } from 'src/app/utils/common-util';
import { MetaTagsService } from '../../modules/shared/services/meta-tags/meta-tags.service';
import { MetaTagsEnum } from '../../shared/constants/meta-tags.enum';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    public metaService: Meta,
    private metaTagsService: MetaTagsService,
    private titleService: Title) { }

  ngOnInit(): void {
    this.setMetaTagAndTitle();
  }

  /**
   * Meta tag and title
   */
  setMetaTagAndTitle() {
    this.metaTagsService?.metaTags.subscribe(res => {
      if (res) {
        let metaData = res.filter(ele => {
          return ele.meta_type === MetaTagsEnum.PRIVACY_POLICY
        })
        const data = {
          title: 'Gytree - Privacy Policy',
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
