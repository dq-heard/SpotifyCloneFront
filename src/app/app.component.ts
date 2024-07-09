import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { NgbModal, NgbModalRef, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { LibraryComponent } from './layout/library/library.component';
import { HeaderComponent } from './layout/header/header.component';
import { ToastService } from './service/toast.service';
import { AuthPopupState, AuthService } from './service/auth.service';
import { PlayerComponent } from './layout/player/player.component';
import { AuthPopupComponent } from './layout/auth-popup/auth-popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    FontAwesomeModule,
    NavigationComponent,
    LibraryComponent,
    HeaderComponent,
    PlayerComponent,
    NgbToast,
  ],
})
export class AppComponent implements OnInit {
  title = 'spotify-clone';

  private faIconLibrary = inject(FaIconLibrary);

  toastService = inject(ToastService);

  private authService = inject(AuthService);

  private modalService = inject(NgbModal);

  private authModalRef: NgbModalRef | null = null;

  constructor() {
    effect(
      () => {
        this.openOrCloseAuthModal(this.authService.authPopupStateChange());
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.initFontAwesome();
  }

  private initFontAwesome() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  private openOrCloseAuthModal(state: AuthPopupState) {
    if (state === 'OPEN') {
      this.openAuthPopup();
    } else if (
      this.authModalRef !== null &&
      state === 'CLOSE' &&
      this.modalService.hasOpenModals()
    ) {
      this.authModalRef.close();
    }
  }

  private openAuthPopup() {
    this.authModalRef = this.modalService.open(AuthPopupComponent, {
      ariaDescribedBy: 'authentication-modal',
      centered: true,
    });

    this.authModalRef.dismissed.subscribe({
      next: () => {
        this.authService.openOrCloseAuthPopup('CLOSE');
      },
    });

    this.authModalRef.closed.subscribe({
      next: () => {
        this.authService.openOrCloseAuthPopup('CLOSE');
      },
    });
  }
}
