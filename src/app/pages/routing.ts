import { Routes } from '@angular/router';
import { AuthGuard } from '../modules/auth/services/auth.guard';
import { PendingChangesGuard } from '../shared/services/pending-changes.guard';

const Routing: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'schedule',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./schedule/schedule.module').then((m) => m.ScheduleModule),
  },
  {
    path: 'prescription',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./prescription/prescription.module').then((m) => m.PrescriptionModule),
  },
  {
    path: 'package',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./package/package.module').then((m) => m.PackageModule),
  },
  {
    path: 'book-test',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./book-test/book-test.module').then((m) => m.BookTestModule),
  },
  {
    path: 'book-doctor',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./book-doctor/book-doctor.module').then((m) => m.BookDoctorModule),
  },
  {
    path: 'consult/:slug',
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard],
    loadChildren: () =>
      import('./consult/consult.module').then((m) => m.ConsultModule),
  },
  {
    path: 'expert-consult',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./consult/consult.module').then((m) => m.ConsultModule),
  },
  {
    path: 'schedule-appointment/:slug',
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard],
    loadChildren: () =>
      import('./schedule-appointment/schedule-appointment.module').then((m) => m.ScheduleAppointmentModule),
  },
  {
    path: 'appointment-confirmed',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./appointment-confirmed/appointment-confirmed.module').then((m) => m.AppointmentConfirmedModule),
  },
  {
    path: 'billing',
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard],
    loadChildren: () =>
      import('./billing/billing.module').then((m) => m.BillingModule),
  },
  {
    path: 'invoice',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./invoice/invoice.module').then((m) => m.InvoiceModule),
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
