import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'packages',
    loadChildren: () =>
      import('./packages/packages.module').then((m) => m.PackagesModule),
  },
  {
    path: 'packages/:filter-type/:filter',
    loadChildren: () =>
      import('./packages/packages.module').then((m) => m.PackagesModule),
  },
  {
    path: 'package-details/:slug',
    loadChildren: () =>
      import('./package-details/package-details.module').then((m) => m.PackageDetailsModule),
  },
  {
    path: 'lab-test',
    loadChildren: () =>
      import('./lab-test/lab-test.module').then((m) => m.LabTestModule),
  },

  {
    path: 'lab-test-details/:slug',
    loadChildren: () =>
      import('./lab-test-details/lab-test-details.module').then((m) => m.LabTestDetailsModule),
  },
  {
    path: 'our-experts',
    loadChildren: () =>
      import('./our-team/our-team.module').then((m) => m.OurTeamModule),
  },
  {
    path: 'doctor-details/:slug',
    loadChildren: () =>
      import('./doctor-details/doctor-details.module').then((m) => m.DoctorDetailsModule),
  },
  {
    path: 'our-story',
    loadChildren: () =>
      import('./our-story/our-story.module').then((m) => m.OurStoryModule),
  },
  {
    path: 'contact-us',
    loadChildren: () =>
      import('./contact-us/contact-us.module').then((m) => m.ContactUsModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyModule),
  },
  {
    path: 'terms-conditions',
    loadChildren: () =>
      import('./terms-conditions/terms-conditions.module').then((m) => m.TearmsConditionsModule),
  },
  {
    path: 'faq',
    loadChildren: () =>
      import('./faq/faq.module').then((m) => m.FaqModule),
  },
  {
    path: 'our-approach',
    loadChildren: () =>
      import('./our-approach/our-approach.module').then((m) => m.OurApproachModule),
  },
  {
    path: 'doctor-didi',
    loadChildren: () =>
      import('./doctor-didi/doctor-didi.module').then((m) => m.DoctorDidiModule),
  },
  {
    path: 'what-we-treat',
    loadChildren: () =>
      import('./what-we-treat/what-we-treat.module').then((m) => m.WhatWeTreatModule),
  },
  {
    path: 'sitemap',
    loadChildren: () =>
      import('./sitemap/sitemap.module').then((m) => m.SitemapModule),
  },
  {
    path: 'founder',
    loadChildren: () =>
      import('./founder/founder.module').then((m) => m.FounderModule),
  },
  
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
