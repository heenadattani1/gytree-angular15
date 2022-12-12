// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  version: '1.0.31',
  appVersion: 'v1.0.1',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'api',
  apiUrls: {
    baseUrl: 'https://api.gytree.com/'
  },
  bucketImageUrl: 'https://image.gytree.com/assets',
  gaTrackingId: 'G-0DHVPRG50V',
  razorPayUrl: 'rzp_live_okIUXLjIuq5z5z',   // live
  // razorPayUrl: 'rzp_test_IJd131qZHYHDfr',   // test
  isEventTrackingEnabled: true,
  isConsoleLogEnabled: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
