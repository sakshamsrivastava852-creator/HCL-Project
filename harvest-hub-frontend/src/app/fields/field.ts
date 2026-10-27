import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FieldService } from "../services/field.service";
import { Field as FieldModel } from "../models/field.model";

@Injectable({
  providedIn: "root"
})
export class Field extends FieldService {
  constructor(http: HttpClient) {
    super(http);
  }
}
