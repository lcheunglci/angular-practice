export const environment = {
  production: true,
  DB_URL: process.env['NG_APP_DB_URL'],
  UPLOAD_URL: process.env['UPLOAD_URL'],
  AUTH_SIGN_UP_URL: process.env['NG_APP_FB_AUTH_SIGNUP_URL'],
  AUTH_SIGN_IN_URL: process.env['NG_APP_FB_AUTH_SIGNIN_URL'],
  FB_API_KEY: process.env['NG_APP_FB_AUTH_API'],
  GOOGLE_MAP_API_KEY: process.env['NG_GOOGLE_MAPS_API']
};
