import { Inject, Injectable, InjectionToken } from "@angular/core";
import { User } from "./shared/models/user";
import {CartProduct} from "./shared/models/CDP-Models/CartProduct";

export const GIGYA_CDP = new InjectionToken("gigya cdp");

@Injectable({
  providedIn: "root",
})
export class ReportService {
  constructor(
    @Inject(GIGYA_CDP)
    private CDP: { report(eventName: string, payload: object): void }
  ) {}

  onAddToCart(payload: CartProduct) {
    this.CDP.report("Add To Cart", payload);
  }

  onLogin(user: User) {
    this.CDP.report("On Login", {
      ciamId: user.$key,
    });
  }
}
