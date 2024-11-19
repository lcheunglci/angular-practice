export const environment = {
  production: false,
  firebase: {
    projectId: process.env['FB_PROJECTID'],
    appId: process.env['FB_APPID'],
    storageBucket: process.env['FB_STORAGEBUCKET'],
    apiKey: process.env['FB_APIKEY'],
    authDomain: process.env['FB_AUTHDOMAIN'],
    messagingSenderId: process.env['FB_MESSAGINGSENDERID'],
  },
};
