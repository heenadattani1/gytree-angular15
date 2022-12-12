import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SitemapService } from '../../modules/shared/services/sitemap/sitemap.service';
import { TYPES } from './sitemap.constant';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {

  dataList;
  dataTypes;
  typesList = TYPES;
  subscriptions: Subscription[] = []

  constructor(
    private titleService: Title,
    private cdr: ChangeDetectorRef,
    private sitemapService: SitemapService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Gytree - Sitemap');
    this.getPrivacyPolicy();
  }

  /**
   * Method to get Privacy Policy from api 
   */
   getPrivacyPolicy() {
    this.subscriptions.push(this.sitemapService.getSitemapData().subscribe((data) => {
      if (data?.success) {
        this.dataList = data.data;
        this.dataTypes = Object.keys(this.dataList);
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
