import { Inject, Injectable, InjectionToken } from "@angular/core";
import { User } from "./shared/models/user";

export const GIGYA_CDP = new InjectionToken("gigya cdp");

@Injectable({
  providedIn: "root",
})
export class ReportService {
  constructor() {}

  onAddToCard(payload: { product: string; category: string }) {}

  onLogin(user: User) {}
}
