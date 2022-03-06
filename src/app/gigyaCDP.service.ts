import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class GigyaCDPService {
  private readonly baseURL = "https://localhost:3001";

  constructor(private http: HttpClient) {}

  getUserAccountById(ciamId: string) {
    return this.http.get(`${this.baseURL}/user/${ciamId}`).pipe(
      tap((httpRes) => {
        const customer = httpRes["customer"];

        delete customer["created"];
        delete customer["docSize"];
        delete customer["updated"];
        delete customer["updatedTimestamp"];
        delete customer["viewId"];
        delete customer["firstSeen"];

        return httpRes;
      })
    );
  }
}
