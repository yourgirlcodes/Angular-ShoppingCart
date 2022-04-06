import { TranslateService } from "src/app/shared/services/translate.service";
import { Component, Input, OnInit } from "@angular/core";
import { Product } from "src/app/shared/models/product";
import { ProductService } from "src/app/shared/services/product.service";
import { ToastrService } from "src/app/shared/services/toastr.service";
import { map } from "rxjs/operators";

@Component({
  selector: "recently-viewed",
  templateUrl: "./recently-viewed.component.html",
  styleUrls: ["./recently-viewed.component.scss"],
})
export class RecentlyViewedComponent implements OnInit {
  bestProducts: Product[] = [];
  options: any;
  loading = false;

  @Input() recentlyViewed: any[];

  constructor(
    private productService: ProductService,
    private toasterService: ToastrService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.options = {
      dots: false,
      responsive: {
        0: { items: 1, margin: 5 },
        430: { items: 2, margin: 5 },
        550: { items: 3, margin: 5 },
        670: { items: 4, margin: 5 },
      },
      autoplay: false,
      loop: false,
      autoplayTimeout: 3000,
      lazyLoad: true,
    };
    this.getAllProducts();
  }

  getAllProducts() {
    this.loading = true;
    const x = this.productService.getProducts();
    x.pipe(map((products) => products.slice(0, 5))).subscribe(
      (products) => {
        this.loading = false;
        this.bestProducts = [];
        products.forEach((element) => {
          const y = { ...element };
          this.bestProducts.push(y as Product);
        });
      },
      (error) => {
        this.toasterService.error("Error while fetching Products", error);
      }
    );
  }
}
