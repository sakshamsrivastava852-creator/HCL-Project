import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { CropPlan, PlanStatus } from "../models/crop-plan.model";

@Injectable({
  providedIn: "root"
})
export class CropPlanService {
  private readonly apiUrl = "http://localhost:8080/api/crop-plans";

  constructor(private http: HttpClient) {}

  getCropPlans(): Observable<CropPlan[]> {
    console.log("CropPlanService: Dispatching GET to", this.apiUrl);
    return this.http.get<CropPlan[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("CropPlanService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getCropPlanById(id: number): Observable<CropPlan> {
    return this.http.get<CropPlan>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("CropPlanService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  createCropPlan(plan: CropPlan): Observable<CropPlan> {
    return this.http.post<CropPlan>(this.apiUrl, plan).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("CropPlanService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  updateCropPlan(id: number, plan: CropPlan): Observable<CropPlan> {
    return this.http.put<CropPlan>(`${this.apiUrl}/${id}`, plan).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("CropPlanService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  updateStatus(id: number, status: PlanStatus): Observable<CropPlan> {
    return this.http.patch<CropPlan>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("CropPlanService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  deleteCropPlan(id: number): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("CropPlanService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
