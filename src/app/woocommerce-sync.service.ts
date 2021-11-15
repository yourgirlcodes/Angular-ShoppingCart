import { Injectable } from "@angular/core";
import { User } from "./shared/models/user";
import { HttpClient } from "@angular/common/http";
import { Product } from "./shared/models/product";

@Injectable({
  providedIn: "root",
})
export class WoocommerceSyncService {
  private readonly baseURL = "https://localhost:3001";

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(`${this.baseURL}/products`);
  }

  syncUser(user: User) {
    return this.http.post(`${this.baseURL}/customers`, {
      email: user.emailId,
      first_name: user.userName,
      last_name: "",
      username: "",
      billing: {
        first_name: user.userName,
        last_name: "",
        company: "",
        address_1: "",
        address_2: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
        email: user.emailId,
        phone: "",
      },
      shipping: {
        first_name: user.userName,
        last_name: "",
        company: "",
        address_1: "",
        address_2: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
      },
    });
  }

  order(user: User, products: Product[]) {
    return this.http.post(`${this.baseURL}/orders`, {
      billing: toContact(user),
      shipping: toContact(user),
      payment_method: "bacs",
      payment_method_title: "Direct Bank Transfer",
      set_paid: true,
      line_items: countById(products),
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: "Flat Rate",
          total: products.reduce((sum, cur) => sum + cur.productPrice, 0),
        },
      ],
    });

    function toContact(user: User) {
      return {
        first_name: user.firstName,
        last_name: user.lastName,
        address_1: user.address1,
        address_2: user.address2,
        state: user.state,
        postcode: user.zip,
        country: user.country,
        email: user.emailId,
      };
    }

    function countById(products: Product[]) {
      return Object.entries(
        products.reduce((res, cur) => {
          if (cur.productId in res) {
            res[cur.productId]++;
          } else {
            res[cur.productId] = 1;
          }
          return res;
        }, {})
      ).map(([product_id, quantity]) => ({ product_id, quantity }));
    }
  }
}
