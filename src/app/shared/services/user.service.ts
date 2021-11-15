import { Injectable } from "@angular/core";

import * as moment from "moment";
import { User } from "../models/user";
import { Observable, of } from "rxjs";

@Injectable()
export class UserService {
  selectedUser: User = new User();
  users: User[] = [];

  location = {
    lat: null,
    lon: null,
  };

  constructor() {
    this.getUsers();
  }

  getUsers() {
    return of(this.users);
  }

  getUserById(id: string) {}

  createUser(data: any) {
    const updatedData = {
      ...data,
      location: this.location,
      createdOn: moment(new Date()).format("X"),
      isAdmin: false,
    };
    this.users.push(updatedData);
  }

  isAdmin(emailId: string) {
    return of([]);
  }

  updateUser(user: User) {
    this.users.splice(
      this.users.findIndex((u) => u.$key == user.$key),
      1,
      user
    );
  }

  setLocation(lat: any, lon: any) {
    this.location = { lat, lon };
  }
}
