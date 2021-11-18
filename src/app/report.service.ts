import { Inject, Injectable, InjectionToken } from "@angular/core";
import { User } from "./shared/models/user";

export const GIGYA_CDP = new InjectionToken("gigya cdp");

@Injectable({
  providedIn: "root",
})
export class ReportService {
  constructor(
    @Inject(GIGYA_CDP)
    private cdp: { report(eventName: string, payload: object): void }
  ) {}

  onAddToCard(payload: { product: string; category: string }) {
    this.cdp.report("On Add To Cart", payload);
  }

  onLogin(user: User) {}
}
