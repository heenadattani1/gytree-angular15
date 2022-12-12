import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/auth/services/auth.guard';
import { MetaTagsResolver } from './modules/shared/services/meta-tags/meta-tags.resolver';
import { HomeApiResolver } from './web-pages/home/home.resolver';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    resolve: {
      home :  HomeApiResolver,
      data: MetaTagsResolver,
    },
    loadChildren: () =>
      import('./web-pages/web-layout/web-layout.module').then((m) => m.WebLayoutModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    resolve: {
      home :  HomeApiResolver,
      data: MetaTagsResolver
    },
    loadChildren: () =>
      import('./_metronic/layout/layout.module').then((m) => m.LayoutModule),
  },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking',
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
