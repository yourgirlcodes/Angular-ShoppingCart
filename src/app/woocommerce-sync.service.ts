import { Injectable } from "@angular/core";
import { User } from "./shared/models/user";
import { HttpClient } from "@angular/common/http";
import { Product } from "./shared/models/product";
import { uuid } from "uuid";

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
      email: user.primaryEmail,
      first_name: user.firstName,
      last_name: "",
      username: "",
      billing: {
        first_name: user.firstName,
        last_name: user.lastName,
        company: "",
        address_1: "",
        address_2: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
        email: user.primaryEmail,
        phone: "",
      },
      shipping: {
        first_name: user.userName,
        last_name: user.lastName,
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
    console.log("WOOCOMMERCE ORDER:", user, products);
    const transactionId = `${Math.random()
      .toString(20)
      .substr(2, 9)}-${Date.now()}`;

    return this.http.post(`${this.baseURL}/orders`, {
      transaction_id: transactionId,
      total: products
        .reduce((sum, cur) => sum + Number(cur.productPrice), 0)
        .toString(),
      billing: toContact(user),
      shipping: toContact(user),
      payment_method: "bacs",
      payment_method_title: "Direct Bank Transfer",
      set_paid: true,
      line_items: countById(products, transactionId),
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: "Flat Rate",
          total: products
            .reduce((sum, cur) => sum + Number(cur.productPrice), 0)
            .toString(),
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
        email: user.primaryEmail,
      };
    }

    function countById(products: Product[], transactionId: string) {
      return Object.entries(
        products.reduce((res, cur) => {
          if (cur.productId in res) {
            res[cur.productId]++;
          } else {
            res[cur.productId] = 1;
          }
          return res;
        }, {})
      ).map(([product_id, quantity], index) => ({
        orderId: transactionId,
        product_id: Number(product_id),
        name: products[index].productName,
        quantity,
        category: products[index].productCategory,
        price: products[index].productPrice,
      }));
    }
  }
}
