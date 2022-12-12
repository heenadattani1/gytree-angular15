import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CommonUtil } from 'src/app/utils/common-util';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NavigateService } from '../../modules/shared/helper-utils/navigate.service';
import { CAROUSEL_CONFIG, OUR_STORY_SHAPING_GYTREE } from './our-story.constant';
import { MetaTagsEnum } from '../../shared/constants/meta-tags.enum';
import { MetaTagsService } from '../../modules/shared/services/meta-tags/meta-tags.service';

@Component({
  selector: 'app-our-story',
  templateUrl: './our-story.component.html',
  styleUrls: ['./our-story.component.scss']
})
export class OurStoryComponent implements OnInit {

  carouselDots;
  carouselList: OwlOptions;
  carouselConfig = CAROUSEL_CONFIG;
  shapingGytree: OwlOptions = this.carouselConfig.shapingGytreeConfig;
  shapingGytreeConfig: OwlOptions = this.carouselConfig.shapingGytree;
  shapingGytreeTeam = OUR_STORY_SHAPING_GYTREE;

  @HostListener('window:scroll', ['$event'])

  onScroll(e: any) {
    this.allScrollEvents();
  }

  isDataVisible = {
    shapingGytree: false,
  }

  constructor(
    public metaService: Meta,
    private titleService: Title,
    private cdr: ChangeDetectorRef,
    private metaTagsService: MetaTagsService,
    private navigateService: NavigateService) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.screenWidth();
    this.setMetaTagAndTitle();
    this.carouselList = this.carouselConfig.newOfferList;
  }

  /**
   * Method to get the screen size
   */
  screenWidth() {
    //mobile screen size is 575
    if (window.innerWidth <= 837) {
      this.carouselDots = true;
    } else {
      this.carouselDots = false;
    }
    this.cdr.detectChanges();
  }

  /**
   * Method to redirect to founder screen
   */
  redirectToFounder() {
    this.navigateService.navigation(['/founder']);
  }

  /**
   * Method to redirect to packages or experts screen
   * @param type package/experts
   */
  redirectionClickHandler(type) {
    this.navigateService.navigation([type]);
  }

  allScrollEvents() {
    this.shapingGytreeScrollEvent();
  }

  shapingGytreeScrollEvent() {
    var offsets = document.getElementById('shaping-gytree-block').getBoundingClientRect();
    var top = offsets.top;
    if (top < 1200 && !this.isDataVisible.shapingGytree) {
      this.shapingGytreeTeam = OUR_STORY_SHAPING_GYTREE;
      this.isDataVisible.shapingGytree = true;
    }
  }


  /**
   * Meta tag and title
   */
  setMetaTagAndTitle() {
    this.metaTagsService?.metaTags.subscribe(res => {
      if (res) {
        let metaData = res.filter(ele => {
          return ele.meta_type === MetaTagsEnum.OUR_STORY
        })
        const data = {
          title: 'Gytree - Our Story',
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