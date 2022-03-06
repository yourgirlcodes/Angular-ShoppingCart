import { Product } from "../../../../../shared/models/product";
import { ShippingService } from "../../../../../shared/services/shipping.service";
import { User } from "../../../../../shared/models/user";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { ProductService } from "../../../../../shared/services/product.service";
import { AuthService } from "../../../../../shared/services/auth.service";

@Component({
  selector: "app-shipping-details",
  templateUrl: "./shipping-details.component.html",
  styleUrls: ["./shipping-details.component.scss"],
})
export class ShippingDetailsComponent implements OnInit {
  userDetails: User = new User();

  products: Product[];

  constructor(
    authService: AuthService,
    private shippingService: ShippingService,
    productService: ProductService,
    private router: Router
  ) {
    /* Hiding products Element */
    document.getElementById("productsTab").style.display = "none";
    document.getElementById("shippingTab").style.display = "block";
    document.getElementById("productsTab").style.display = "none";
    document.getElementById("resultTab").style.display = "none";

    this.products = productService.getLocalCartProducts();
    authService.user$.subscribe((user) => {
      this.userDetails = user;
    });
  }

  ngOnInit() {}

  updateUserDetails(form: NgForm) {
    const products = [];
    let totalPrice = 0;
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
      shippingDate: Date.now(),
    };

    console.log({ data });

    // this.shippingService.createshippings(data);

    this.router.navigate([
      "checkouts",
      { outlets: { checkOutlet: ["billing-details"] } },
    ]);
  }
}
