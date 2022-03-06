import { Inject, Injectable, InjectionToken, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { ToastrService } from "src/app/shared/services/toastr.service";

import { User } from "../models/user";
import { ReportService } from "../../report.service";
import { GigyaCDPService } from "../../gigyaCDP.service";

export const ANONYMOUS_USER: User = new User();

export const GIGYA_CIAM = new InjectionToken("gigya ciam");

@Injectable()
export class AuthService {
  authenticatedUser: User;

  private _user$ = new BehaviorSubject<User>(undefined);

  user$: Observable<User> = this._user$.asObservable().pipe(
    tap((user) => (this.authenticatedUser = user)),
    filter((user) => !!user)
  );

  isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map((user) => !!user.$key)
  );

  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(
    map((isLoggedIn) => !isLoggedIn)
  );

  isAdmin$: Observable<boolean> = this.user$.pipe(
    map((user) => !!user.isAdmin)
  );

  constructor(
    private toastrService: ToastrService,
    private router: Router,
    reportService: ReportService,
    private zone: NgZone,
    private gigyaCDP: GigyaCDPService, //
    @Inject(GIGYA_CIAM) private gigya: any
  ) {
    this.gigya.accounts.addEventHandlers({
      onLogin: (e) => {
        location.reload();
        return this.refresh();
      },
      onLogout: (e) => {
        this._user$.next(ANONYMOUS_USER);
      },
    });
    combineLatest([this.user$, this.isLoggedIn$])
      .pipe(
        filter(([_, loggedIn]) => loggedIn),
        map(([user]) => user)
      )
      .subscribe((user) => reportService.onLogin(user));

    this.refresh();
  }

  async refresh() {
    return await this.zone.runOutsideAngular(() => {
      return new Promise((r) =>
        this.gigya.accounts.getAccountInfo({
          callback: (res) => {
            console.log("getAccountInfo", res);

            let knownUser: User = {
              // have an interface for this that matches
              $key: res.UID,
              primaryEmail: res.profile?.email,
              userName: `${res.profile?.firstName} ${res.profile?.lastName}`,
              firstName: res.profile?.firstName,
              lastName: res.profile?.lastName,
              isAdmin: false,
            };

            this._user$.next(res.errorCode !== 0 ? ANONYMOUS_USER : knownUser);
            r(res);
          },
        })
      );
    });
  }

  logout() {
    this.gigya.accounts.logout();
  }

  showRegistrationLogin() {
    this.gigya.accounts.showScreenSet({
      screenSet: "Default-RegistrationLogin",
      startScreen: "gigya-login-screen",
    });
  }

  createUserWithEmailAndPassword(emailID: string, password: string) {}

  openEditUserDetailsModal() {
    this.gigya.accounts.showScreenSet({
      screenSet: "Default-ProfileUpdate",
      onAfterSubmit: (e) => {
        console.log({ e });

        const updatedUserDetails = {
          ...this.authenticatedUser,
          ...e.profile,
          primaryEmail: e.profile.email,
        };

        this._user$.next(updatedUserDetails);

        console.log({ updatedUserDetails });

        this.toastrService.wait(
          "Loading...",
          "Updating your profile...",
          22000
        );

        setTimeout(async () => {
          // await this.refresh();
          this.toastrService.success(
            "Got it!",
            "Your profile should be updated!"
          );
        }, 25000);
      },
    });
  }
}
