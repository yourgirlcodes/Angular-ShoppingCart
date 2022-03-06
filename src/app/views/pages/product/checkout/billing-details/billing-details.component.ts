import { ProductService } from "../../../../../shared/services/product.service";
import { Product } from "../../../../../shared/models/product";
import { BillingService } from "../../../../../shared/services/billing.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../../../../shared/models/user";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { map } from "rxjs/operators";
import { AuthService } from "../../../../../shared/services/auth.service";

@Component({
  selector: "app-billing-details",
  templateUrl: "./billing-details.component.html",
  styleUrls: ["./billing-details.component.scss"],
})
export class BillingDetailsComponent implements OnInit {
  userDetails: User = new User();
  products: Product[];

  constructor(
    authService: AuthService,
    // private billingService: BillingService,
    productService: ProductService,
    private router: Router
  ) {
    /* Hiding Shipping Tab Element */
    document.getElementById("productsTab").style.display = "none";
    document.getElementById("shippingTab").style.display = "none";
    document.getElementById("billingTab").style.display = "block";
    document.getElementById("resultTab").style.display = "none";

    this.products = productService.getLocalCartProducts();
    authService.user$.subscribe((user) => {
      this.userDetails = user;
    });
  }

  ngOnInit() {}

  updateUserDetails(form: NgForm) {
    let totalPrice = 0;
    const products = [];
    this.products.forEach((product) => {
      delete product.$key;
      totalPrice += Number(product.productPrice);
      products.push(product);
    });

    const data = {
      ...form.value,
      emailId: this.userDetails.primaryEmail,
      userId: this.userDetails.$key,
      products,
      totalPrice,
      billingDate: Date.now(),
    };
    console.log({ data });
    // this.billingService.createBillings(data);

    this.router.navigate([
      "checkouts",
      { outlets: { checkOutlet: ["result"] } },
    ]);
  }
}
