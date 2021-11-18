import { Injectable } from "@angular/core";
import { Product } from "../models/product";
import { ToastrService } from "./toastr.service";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { WoocommerceSyncService } from "../../woocommerce-sync.service";
import { User } from "../models/user";
import { ReportService } from "../../report.service";

@Injectable()
export class ProductService {
  products: Product[];
  product: Product;

  // favouriteProducts
  favouriteProducts: FavouriteProduct[];
  cartProducts: FavouriteProduct;

  constructor(
    private woocommerce: WoocommerceSyncService,
    private toastrService: ToastrService
  ) {}

  private products$: Observable<Product[]> = this.getProducts();

  getProducts() {
    this.products$ = this.woocommerce.getProducts().pipe(
      map((products: any[]) =>
        products.map((product) => ({
          $key: product.id,
          favourite: false,
          productAdded: 0,
          productCategory: product.categories?.[0]?.name ?? "",
          productDescription: product.description.replace("<p>", ""),
          productId: product.id,
          productImageUrl: product.images ? product.images[0].src : "",
          productName: product.name,
          productPrice: product.price,
          productQuatity: product.stock_quantity || 0,
          productSeller: "",
          ratings: product.rating_count,
        }))
      ),
      tap((products) => (this.products = products))
    );

    return this.products$;
  }

  async createProduct(data: Product) {}

  getProductById(key: string) {
    return this.products$.pipe(
      map((prods) => prods.find((p) => p.$key == key))
    );
  }

  deleteProduct(key: string) {
    this.products.splice(
      this.products.findIndex((p) => p.$key == key),
      1
    );
  }

  /*
   ----------  Favourite Product Function  ----------
  */

  // Get Favourite Product based on userId
  async getUsersFavouriteProduct() {
    return new Promise((res, rej) => {
      res([]);
    });
  }

  // Adding New product to favourite if logged else to localStorage
  addFavouriteProduct(data: Product): void {
    const a: Product[] = JSON.parse(localStorage.getItem("avf_item")) || [];
    a.push(data);
    this.toastrService.wait("Adding Product", "Adding Product as Favourite");
    setTimeout(() => {
      localStorage.setItem("avf_item", JSON.stringify(a));
    }, 1500);
  }

  // Fetching unsigned users favourite proucts
  getLocalFavouriteProducts(): Product[] {
    const products: Product[] =
      JSON.parse(localStorage.getItem("avf_item")) || [];

    return products;
  }

  // Removing Favourite Product from Database
  removeFavourite(key: string) {
    // this.favouriteProducts.remove(key);
  }

  // Removing Favourite Product from localStorage
  removeLocalFavourite(product: Product) {
    const products: Product[] = JSON.parse(localStorage.getItem("avf_item"));

    for (let i = 0; i < products.length; i++) {
      if (products[i].productId === product.productId) {
        products.splice(i, 1);
        break;
      }
    }
    // ReAdding the products after remove
    localStorage.setItem("avf_item", JSON.stringify(products));
  }

  /*
   ----------  Cart Product Function  ----------
  */

  // Adding new Product to cart db if logged in else localStorage
  addToCart(data: Product): void {
    const a: Product[] = JSON.parse(localStorage.getItem("avct_item")) || [];
    a.push(data);

    this.toastrService.wait(
      "Adding Product to Cart",
      "Product Adding to the cart"
    );
    setTimeout(() => {
      localStorage.setItem("avct_item", JSON.stringify(a));
    }, 500);
  }

  // Removing cart from local
  removeLocalCartProduct(product: Product) {
    const products: Product[] = JSON.parse(localStorage.getItem("avct_item"));

    for (let i = 0; i < products.length; i++) {
      if (products[i].productId === product.productId) {
        products.splice(i, 1);
        break;
      }
    }
    // ReAdding the products after remove
    localStorage.setItem("avct_item", JSON.stringify(products));
  }

  clearLocalCart() {
    localStorage.setItem("avct_item", JSON.stringify([]));
  }

  // Fetching Locat CartsProducts
  getLocalCartProducts(): Product[] {
    const products: Product[] =
      JSON.parse(localStorage.getItem("avct_item")) || [];

    return products;
  }

  orderCartProducts(user: User) {
    return this.woocommerce.order(user, this.getLocalCartProducts() || []);
  }
}

export class FavouriteProduct {
  product: Product;
  productId: string;
  userId: string;
}
