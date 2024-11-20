export const environment = {
  production: false,
  firebase: {
    projectId: import.meta.env['NG_APP_FB_PROJECTID'],
    appId: import.meta.env['NG_APP_FB_APPID'],
    storageBucket: import.meta.env['NG_APP_FB_STORAGEBUCKET'],
    apiKey: import.meta.env['NG_APP_FB_APIKEY'],
    authDomain: import.meta.env['NG_APP_FB_AUTHDOMAIN'],
    messagingSenderId: process.env['NG_APP_FB_MESSAGINGSENDERID'],
  },
};
