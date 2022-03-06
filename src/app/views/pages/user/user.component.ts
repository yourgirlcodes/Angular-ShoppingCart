import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "src/app/shared/models/user";
import { ActivatedRoute } from "@angular/router";
import { CDPUserService } from "../../../shared/services/user.service";
import { Activities } from "../../../shared/models/CDP-Models/Activities";
import { filter } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";
import { ProductService } from "../../../shared/services/product.service";
import { Indicator } from "../../../shared/models/CDP-Models/Entities";
import { AuthService } from "../../../shared/services/auth.service";
import {
  BaseCustomer,
  CDPCustomer,
} from "../../../shared/models/CDP-Models/Customer";

@Component({
  selector: "app-user-account",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit, OnDestroy {
  cdpUserAccount: CDPCustomer | null;
  activities: Activities;
  authUser: User;
  baseUserDetails: BaseCustomer;
  uniqueCartItems: any = [];
  relevantOrders: any = [];

  subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private userService: CDPUserService,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.subs.add(
      this.authService.user$
        .pipe(
          filter((authUser) => {
            return !!authUser;
          })
        )
        .subscribe((user) => {
          this.baseUserDetails = {
            primaryEmail: user.primaryEmail,
            firstName: user.firstName,
          };
        })
    );

    this.subs.add(
      this.userService.selectedCDPUserAcc$
        .pipe(
          filter((res) => {
            return !!res;
          })
        )
        .subscribe((acc) => {
          acc && this.getUserAccount(acc);
        })
    );

    this.userService.refreshData();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  getUserAccount(acc) {
    const { customer, activities } = acc;

    const profile: CDPCustomer = {
      ...customer,
      activityIndicators: this.getActivityIndicators(
        customer.activityIndicators
      ),
      ...this.baseUserDetails,
    };

    this.cdpUserAccount = profile;
    this.activities = activities;

    this.removeDuplicateCartItems();
    this.removeIrrelevantOrders();
  }

  getActivityIndicators(activityIndicatorArray: Array<Indicator>) {
    let arr = [];

    activityIndicatorArray?.forEach((aI) => {
      arr.push(Object.values(aI));
    });

    arr = arr.filter(
      (a) => a[0] !== ("FavShirtCount" || "Total Cart" || "Total Cart Items")
    );

    return arr;
  }

  removeDuplicateCartItems() {
    let allCartItems = this.activities.cart?.map(
      (item) => item.attributes.product
    );

    if (allCartItems && allCartItems.length <= 0) {
      allCartItems = this.productService
        .getLocalCartProducts()
        .map((item) => item.productName);
    }
    this.uniqueCartItems = [...new Set(allCartItems)];
  }

  removeIrrelevantOrders() {
    this.relevantOrders = this.activities.orders
      ?.map((item) => {
        if (item.attributes.line_items) {
          return item;
        }
      })
      .filter(Boolean);
  }
}
