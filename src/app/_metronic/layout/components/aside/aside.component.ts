import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import { MenuComponent, DrawerComponent } from '../../../kt/components';
import { LocalStorageService } from 'src/app/modules/shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit, OnDestroy {
  asideTheme: string = '';
  asideMinimize: boolean = false;
  asideMenuCSSClasses: string = '';
  userDetails: any;
  @ViewChild('ktAsideScroll', { static: true }) ktAsideScroll: ElementRef;
  private unsubscribe: Subscription[] = [];
  isPortrait = true;

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    this.isCheckOrientationMode(event);
  }

  constructor(private layout: LayoutService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.isCheckOrientationMode();
    this.userDetails = this.localStorageService.getItem('userSlug');
    this.asideTheme = this.layout.getProp('aside.theme') as string;
    this.asideMinimize = this.layout.getProp('aside.minimize') as boolean;
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('asideMenu');
    this.routingChanges();
  }

  isCheckOrientationMode(event: any = null) {
    const windowOrientation = (window as any).orientation || (window as any)?.screen?.orientation?.angle || 0
    switch (windowOrientation) {
      case -90: case 90:
        this.isPortrait = true;
        break;
      case 0:
        this.isPortrait = false;
        break;
      default:
        this.isPortrait = false;
    }
  }

  routingChanges() {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.menuReinitialization();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  menuReinitialization() {
    setTimeout(() => {
      MenuComponent.reinitialization();
      DrawerComponent.reinitialization();
    }, 50);
  }

  logout() {
    this.localStorageService.removeItem('userSlug');
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
