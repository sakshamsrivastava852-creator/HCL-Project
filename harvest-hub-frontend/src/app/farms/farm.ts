import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FarmService } from "../services/farm.service";

export { FarmService };

@Injectable({
  providedIn: "root"
})
export class Farm extends FarmService {
  constructor(http: HttpClient) {
    super(http);
  }
}
