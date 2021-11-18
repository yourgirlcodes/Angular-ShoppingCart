import { Inject, Injectable, InjectionToken } from "@angular/core";
import { User } from "./shared/models/user";

export const GIGYA_CDP = new InjectionToken("gigya cdp");

@Injectable({
  providedIn: "root",
})
export class ReportService {
  constructor(
    @Inject(GIGYA_CDP)
    private CDP: { report(eventName: string, payload: object): void }
  ) {}

  onAddToCard(payload: { product: string; category: string }) {
    this.CDP.report("Add To Cart", payload);
  }

  onLogin(user: User) {
    this.CDP.report("On Login", {
      ciamId: user.$key,
    });
  }
}
