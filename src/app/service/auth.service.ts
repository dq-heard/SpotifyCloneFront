import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Location } from '@angular/common';
import { AuthService as Auth0 } from '@auth0/auth0-angular';

import { State } from './model/state.model';
import { User } from './model/user.model';
import { environment } from '../../environments/environment';

export type AuthPopupState = 'OPEN' | 'CLOSE';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  location = inject(Location);

  notConnected = 'NOT_CONNECTED';

  constructor(private auth: Auth0) {}

  private fetchUser$: WritableSignal<State<User, HttpErrorResponse>> = signal(
    State.Builder<User, HttpErrorResponse>()
      .forSuccess({ email: this.notConnected })
      .build()
  );
  fetchUser = computed(() => this.fetchUser$());

  private triggerAuthPopup$: WritableSignal<AuthPopupState> = signal('CLOSE');
  authPopupStateChange = computed(() => this.triggerAuthPopup$());

  fetch(): void {
    this.http
      .get<User>(`${environment.API_URL}/api/get-authenticated-user`)
      .subscribe({
        next: (user) =>
          this.fetchUser$.set(
            State.Builder<User, HttpErrorResponse>().forSuccess(user).build()
          ),
        error: (err: HttpErrorResponse) => {
          if (
            err.status === HttpStatusCode.Unauthorized &&
            this.isAuthenticated()
          ) {
            this.fetchUser$.set(
              State.Builder<User, HttpErrorResponse>()
                .forSuccess({ email: this.notConnected })
                .build()
            );
          } else {
            this.fetchUser$.set(
              State.Builder<User, HttpErrorResponse>().forError(err).build()
            );
          }
        },
      });
  }

  isAuthenticated(): boolean {
    if (this.fetchUser$().value) {
      return this.fetchUser$().value!.email !== this.notConnected;
    } else {
      return false;
    }
  }

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  openOrCloseAuthPopup(state: AuthPopupState) {
    this.triggerAuthPopup$.set(state);
  }
}
