import { BaseCustomer } from "./CDP-Models/Customer";

export class User {
  $key: string;
  userName: string;
  firstName: string;
  primaryEmail: string;
  password?: string;
  location?: {
    lat: number;
    lon: number;
  };
  phoneNumber?: string;
  createdOn?: string;
  isAdmin?: boolean;
  avatar?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  country?: string;
  state?: string;
  zip?: number;
}
