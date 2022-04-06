import { Activities } from "./Activities";
import { CDPCustomer } from "./Customer";

export interface CDPUserAccount {
  activities: Activities;
  customer: CDPCustomer;
}
