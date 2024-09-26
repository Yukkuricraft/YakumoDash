// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// idk, maybe useful for local dev'ing. Haven't tested.
export const environment = {
  production: false,
  PROTOCOL: "http",
  USE_AUTH: false,
  API_HOST: 'api.localhost',
  FILEBROWSER_HOST: 'filebrowser.localhost',
  WSS_HOST: 'localhost',
  G_OAUTH2_CLIENT_ID: '1084736521175-4p43u0ddhru6qs6aqd6n4r2smmnffqcu.apps.googleusercontent.com',
  MIN_PROXY_PORT: 26600,
  MAX_PROXY_PORT: 26700,
};