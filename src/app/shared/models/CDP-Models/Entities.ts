import { BaseCustomer, WithCiamId } from "./Customer";

export interface Purpose {
  date: string;
  externalId: string;
  purposeId: string;
  status: string;
}

export interface Attributes extends BaseCustomer, WithCiamId {
  deviceId: string[];
  isSubscribed: boolean;
  lastName: string;
}

export interface Privacy {
  purposes: Purpose[];
  subscriptions: Subscription[];
}

export interface Segment {
  name: string;
  updated: string;
  value: string;
}

export type Indicator = Array<Object>;
export type Subscription = any; // todo: fill in
