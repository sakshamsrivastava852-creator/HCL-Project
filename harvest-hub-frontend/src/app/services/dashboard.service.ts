import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { DashboardStats } from "../models/dashboard.model";

@Injectable({
  providedIn: "root"
})
export class DashboardService {
  private readonly apiUrl = "http://localhost:8080/api/dashboard/stats";

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    const errorMsg = error.error?.message || error.message || "Failed to load dashboard metrics";
    console.error("DashboardService error:", error);
    return throwError(() => new Error(errorMsg));
  }
}
