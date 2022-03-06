import { Attributes, Indicator, Privacy, Segment } from "./Entities";

export interface BaseCustomer {
  primaryEmail: string;
  firstName: string;
}

export interface WithCiamId {
  ciamId: string[];
}

export interface CDPCustomer {
  activityIndicators: Indicator;
  attributes: Attributes;
  calculatedIndicators: Indicator;
  predictiveIndicators: Indicator;
  privacy: Privacy;
  relationships: Array<Object>;
  segments: Segment[];
  viewId: string;
  _id: string;
}

export interface BasicUserDetails extends BaseCustomer {
  ciamId: string;
}
