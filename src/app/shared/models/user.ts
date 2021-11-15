export class User {
  $key: string;
  userName: string;
  emailId: string;
  password?: string;
  location?: {
    lat: number;
    lon: number;
  };
  phoneNumber?: string;
  createdOn?: string;
  isAdmin?: boolean;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  country?: string;
  state?: string;
  zip?: number;
}
