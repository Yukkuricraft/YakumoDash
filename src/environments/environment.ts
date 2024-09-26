// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  PROTOCOL: "https",
  USE_AUTH: true,
  API_HOST: 'dev.api.yukkuricraft.net',
  FILEBROWSER_HOST: 'dev.filebrowser.yukkuricraft.net',
  WSS_HOST: 'dev.docker.yukkuricraft.net',
  G_OAUTH2_CLIENT_ID: '1084736521175-2b5rrrpcs422qdc5458dhisdsj8auo0p.apps.googleusercontent.com',
  MIN_PROXY_PORT: 26600,
  MAX_PROXY_PORT: 26700,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
