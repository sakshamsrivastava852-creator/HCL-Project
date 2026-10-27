import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { FieldOperation, OperationStatus } from "../models/field-operation.model";

@Injectable({
  providedIn: "root"
})
export class FieldOperationService {
  private readonly apiUrl = "http://localhost:8080/api/field-operations";

  constructor(private http: HttpClient) {}

  getFieldOperations(): Observable<FieldOperation[]> {
    console.log("FieldOperationService: Dispatching GET to", this.apiUrl);
    return this.http.get<FieldOperation[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FieldOperationService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getFieldOperationById(id: number): Observable<FieldOperation> {
    return this.http.get<FieldOperation>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FieldOperationService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  createFieldOperation(operation: FieldOperation): Observable<FieldOperation> {
    return this.http.post<FieldOperation>(this.apiUrl, operation).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FieldOperationService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  updateFieldOperation(id: number, operation: FieldOperation): Observable<FieldOperation> {
    return this.http.put<FieldOperation>(`${this.apiUrl}/${id}`, operation).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FieldOperationService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  updateStatus(id: number, status: OperationStatus): Observable<FieldOperation> {
    return this.http.patch<FieldOperation>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FieldOperationService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  deleteFieldOperation(id: number): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FieldOperationService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
