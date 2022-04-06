import { TranslateService } from "src/app/shared/services/translate.service";
import { Component, Input, OnInit } from "@angular/core";
import { Product } from "src/app/shared/models/product";
import { ProductService } from "src/app/shared/services/product.service";
import { ToastrService } from "src/app/shared/services/toastr.service";
import { map } from "rxjs/operators";

@Component({
  selector: "past-orders",
  templateUrl: "./past-orders.html",
  styleUrls: ["./past-orders.scss"],
})
export class PastOrders implements OnInit {
  bestProducts: Product[] = [];
  options: any;
  loading = false;

  @Input() pastOrders: any[];

  constructor(public translate: TranslateService) {}

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
  }
}
