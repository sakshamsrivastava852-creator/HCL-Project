import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Field } from "../models/field.model";

@Injectable({
  providedIn: "root"
})
export class FieldService {
  private readonly apiUrl = "http://localhost:8080/api/fields";

  constructor(private http: HttpClient) {}

  getFields(): Observable<Field[]> {
    console.log("FieldService: Dispatching GET to", this.apiUrl);
    return this.http.get<Field[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FieldService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getFieldById(id: number): Observable<Field> {
    return this.http.get<Field>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FieldService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  createField(field: Field): Observable<Field> {
    return this.http.post<Field>(this.apiUrl, field).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FieldService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  updateField(id: number, field: Field): Observable<Field> {
    return this.http.put<Field>(`${this.apiUrl}/${id}`, field).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FieldService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  deleteField(id: number): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FieldService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
