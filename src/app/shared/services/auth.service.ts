import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { User } from "../models/user";
import { UserService } from "./user.service";

export const ANONYMOUS_USER: User = new User();

@Injectable()
export class AuthService {
  user: User;

  private subject = new BehaviorSubject<User>(undefined);

  user$: Observable<User> = this.subject
    .asObservable()
    .pipe(filter((user) => !!user));

  isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map((user) => !!user.$key)
  );

  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(
    map((isLoggedIn) => !isLoggedIn)
  );

  isAdmin$: Observable<boolean> = this.user$.pipe(
    map((user) => !!user.isAdmin)
  );

  constructor(private router: Router, private userService: UserService) {
    // this.user = init;

    this.user$.subscribe((user) => {
      console.log({ user });
      if (user) {
        this.userService.isAdmin(user.emailId).subscribe((data) => {
          if (!data.length) {
            this.subject.next(ANONYMOUS_USER);
            return;
          }

          data.forEach((el) => {
            const y: any = el.payload.toJSON();
            console.log({ y });
            this.subject.next({
              $key: y.uid || y.id,
              userName: user.userName || "Anonymous User",
              emailId: y.emailId,
              phoneNumber: user.phoneNumber,
              avatar: user.avatar,
              isAdmin: y.isAdmin,
            });
          });
        });
      } else {
        this.subject.next(ANONYMOUS_USER);
      }
    });
  }

  logout() {}

  createUserWithEmailAndPassword(emailID: string, password: string) {}

  signInRegular(email: string, password: string) {}

  signInWithGoogle() {}
}
