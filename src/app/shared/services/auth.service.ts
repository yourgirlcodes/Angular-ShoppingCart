import { Inject, Injectable, InjectionToken, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";

import { User } from "../models/user";
import { ReportService } from "../../report.service";

export const ANONYMOUS_USER: User = new User();

export const GIGYA_CIAM = new InjectionToken("gigya ciam");

@Injectable()
export class AuthService {
  user: User;

  private subject = new BehaviorSubject<User>(ANONYMOUS_USER);

  user$: Observable<User> = this.subject.asObservable().pipe(
    tap((user) => console.log(`changed!`, user)),
    tap((user) => (this.user = user)),
    filter((user) => !!user)
  );

  isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map((user) => !!user.$key),
    tap(() => console.log(`logged in!`))
  );

  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(
    map((isLoggedIn) => !isLoggedIn),
    tap(() => console.log(`logged out!`))
  );

  isAdmin$: Observable<boolean> = this.user$.pipe(
    map((user) => !!user.isAdmin)
  );

  constructor(
    private router: Router,
    private zone: NgZone,
    @Inject(GIGYA_CIAM) private gigya: any,
    private reportService: ReportService
  ) {
    this.gigya.accounts.addEventHandlers({
      onLogin: (e) => this.refresh(),
      onLogout: (e) => this.subject.next(ANONYMOUS_USER),
    });

    this.user$
      .pipe(filter((user) => user != ANONYMOUS_USER))
      .subscribe((user) => this.reportService.onLogin(user));

    this.refresh();
  }

  async refresh() {
    return await this.zone.runOutsideAngular(() => {
      return new Promise((r) =>
        this.gigya.accounts.getAccountInfo({
          callback: (res) => {
            this.subject.next(
              res.errorCode != 0
                ? ANONYMOUS_USER
                : {
                    $key: res.UID,
                    emailId: res.profile?.email,
                    userName: `${res.profile?.firstName} ${res.profile?.lastName}`,
                    firstName: res.profile?.firstName,
                    lastName: res.profile?.lastName,
                    zip: res.profile?.zip,
                    phoneNumber: res.profile?.phone,
                    isAdmin: false,
                  }
            );

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

  signInRegular(email: string, password: string) {}

  signInWithGoogle() {}
}
