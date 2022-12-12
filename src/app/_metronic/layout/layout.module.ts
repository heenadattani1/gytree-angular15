import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InlineSVGModule} from 'ng-inline-svg-2';
import {RouterModule, Routes} from '@angular/router';
import {NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule,} from '@ng-bootstrap/ng-bootstrap';
import {LayoutComponent} from './layout.component';
import {Routing} from '../../pages/routing';
import {AsideComponent} from './components/aside/aside.component';
import {HeaderComponent} from './components/header/header.component';
import {ContentComponent} from './components/content/content.component';
import {ScriptsInitComponent} from './components/scripts-init/scripts-init.component';
import {AsideMenuComponent} from './components/aside/aside-menu/aside-menu.component';
import { AreaCodeModule } from '../../pages/area-code/area-code.module';
import { ImageLazyLoadModule } from 'src/app/shared/image-lazy-load/image-lazy-load.module';
import { PendingChangesGuard } from '../../shared/services/pending-changes.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: Routing,
  },
];

@NgModule({
  declarations: [
    LayoutComponent,
    AsideComponent,
    HeaderComponent,
    ContentComponent,
    ScriptsInitComponent,
    AsideMenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InlineSVGModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    AreaCodeModule,
    ImageLazyLoadModule
  ],
  providers: [PendingChangesGuard],
  exports: [RouterModule],
})
export class LayoutModule {
}
