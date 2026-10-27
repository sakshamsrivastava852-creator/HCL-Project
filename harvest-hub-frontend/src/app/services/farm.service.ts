import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Farm } from "../models/farm.model";

@Injectable({
  providedIn: "root"
})
export class FarmService {
  private readonly apiUrl = "http://localhost:8080/api/farms";

  constructor(private http: HttpClient) {}

  getFarms(): Observable<Farm[]> {
    console.log("FarmService: Dispatching GET to", this.apiUrl);
    return this.http.get<Farm[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FarmService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getFarmById(id: number): Observable<Farm> {
    return this.http.get<Farm>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FarmService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  createFarm(farm: Farm): Observable<Farm> {
    return this.http.post<Farm>(this.apiUrl, farm).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FarmService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  updateFarm(id: number, farm: Farm): Observable<Farm> {
    return this.http.put<Farm>(`${this.apiUrl}/${id}`, farm).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FarmService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  deleteFarm(id: number): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("FarmService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
