import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FORM_VALIDATION } from 'src/app/modules/shared/constants/form-validatin.constant';
import { ContactUsService } from 'src/app/modules/shared/services/contact-us-details/contact-us-details.service';
import { Meta, Title } from '@angular/platform-browser';
import { CommonUtil } from 'src/app/utils/common-util';
import { MetaTagsEnum } from '../../shared/constants/meta-tags.enum';
import { MetaTagsService } from '../../modules/shared/services/meta-tags/meta-tags.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {

  message: string = '';
  contactUsForm = new FormGroup({});
  subscriptions: Subscription[] = [];

  constructor(
    public metaService: Meta,
    private cdr: ChangeDetectorRef,
    private contactUsService: ContactUsService,
    private metaTagsService: MetaTagsService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setMetaTagAndTitle();
  }

  /**
   * Control declaration of contactUsForm
   */
  initForm() {
    this.contactUsForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(FORM_VALIDATION.EMAIL_PATTERN)])),
      message: new FormControl('', [Validators.required]),
    })
  }

  /**
   * Submit Click Handler contactUsForm
   */
  submitContactUsForm() {
    if (this.contactUsForm.invalid) {
      this.contactUsForm.markAllAsTouched();
      return;
    }
    const payload = {
      gtc_name: this.contactUsForm.value.name,
      gtc_email: this.contactUsForm.value.email,
      gtc_address: this.contactUsForm.value.message
    }
    if (this.contactUsForm.valid) {
      this.subscriptions.push(this.contactUsService.sendContactUsDetails(payload).subscribe((data) => {
        if (data?.success) {
          this.contactUsForm.reset();
          this.message = data.data;
        }
        this.cdr.detectChanges();
      }));
    }
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
          return ele.meta_type === MetaTagsEnum.CONTACT_US
        })
        const data = {
          title: 'Gytree - Contact Us',
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
