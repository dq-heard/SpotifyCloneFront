import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAuth0 } from '@auth0/auth0-angular';
import { authInterceptor } from './service/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
    provideAuth0({
      domain: 'dev-m3p6dptt4vt1z8gl.us.auth0.com',
      clientId: 'w1Mwc2z2upXSAd0H2exfWwrysFThtEfn',
      authorizationParams: {
        audience: 'https://dev-m3p6dptt4vt1z8gl.us.auth0.com/api/v2/',
        redirect_uri: window.location.origin,
      },
    }),
    provideAnimations(),
  ],
};
