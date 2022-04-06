import { TranslateService } from "src/app/shared/services/translate.service";
import { Component, Input, OnInit } from "@angular/core";
import { Product } from "src/app/shared/models/product";

@Component({
  selector: "calculated-indicators",
  templateUrl: "./calculated-indicators.html",
  styleUrls: ["./calculated-indicators.scss"],
})
export class CalculatedIndicators implements OnInit {
  bestProducts: Product[] = [];
  options: any;
  loading = false;

  @Input() data: any[];
  @Input() title: string;

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
