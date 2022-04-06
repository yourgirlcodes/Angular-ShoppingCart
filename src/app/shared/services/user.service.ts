import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, of, Subject } from "rxjs";
import { GigyaCDPService } from "../../gigyaCDP.service";
import { filter } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { CDPUserAccount } from "../models/CDP-Models/UserAccount";
import { BaseCustomer, CDPCustomer } from "../models/CDP-Models/Customer";

@Injectable()
export class CDPUserService {
  private _selectedCDPUserAcc$ = new BehaviorSubject<CDPUserAccount>(undefined);
  private baseUserDetails: BaseCustomer;

  refresh$ = new Subject();

  location = {
    lat: null,
    lon: null,
  };

  constructor(
    private gigyaCDP: GigyaCDPService,
    private authService: AuthService
  ) {
    combineLatest([
      authService.user$.pipe(
        filter((res) => {
          return !!res;
        })
      ),
      this.refresh$,
    ]).subscribe(([user]) => {
      this.baseUserDetails = {
        primaryEmail: user.primaryEmail,
        firstName: user.firstName,
      };

      this.getUserAccountById(user.$key);
    });
  }

  public get selectedCDPUserAcc$() {
    return this._selectedCDPUserAcc$.asObservable();
  }

  refreshData() {
    this.refresh$.next();
  }

  getUserAccountById(id: string) {
    this.gigyaCDP
      .getUserAccountById(id)
      .subscribe((account: CDPUserAccount) => {
        const customer = {
          ...account.customer,
          attributes: {
            ...account.customer.attributes,
            ...this.baseUserDetails,
          },
        };

        const customerAccount: CDPUserAccount = {
          ...account,
          customer,
        };

        console.log({ customerAccount });
        this._selectedCDPUserAcc$.next(customerAccount);
      });
  }

  isAdmin(emailId: string) {
    return of([]);
  }

  setLocation(lat: any, lon: any) {
    this.location = { lat, lon };
  }

  clearUser() {
    this._selectedCDPUserAcc$.next(null);
  }
}
