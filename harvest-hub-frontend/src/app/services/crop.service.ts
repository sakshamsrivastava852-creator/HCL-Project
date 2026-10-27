import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Crop } from "../models/crop.model";

@Injectable({
  providedIn: "root"
})
export class CropService {
  private readonly apiUrl = "http://localhost:8080/api/crops";

  constructor(private http: HttpClient) {}

  getCrops(): Observable<Crop[]> {
    console.log("CropService: Dispatching GET to", this.apiUrl);
    return this.http.get<Crop[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("CropService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getCropById(id: number): Observable<Crop> {
    return this.http.get<Crop>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("CropService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  createCrop(crop: Crop): Observable<Crop> {
    return this.http.post<Crop>(this.apiUrl, crop).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("CropService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  updateCrop(id: number, crop: Crop): Observable<Crop> {
    return this.http.put<Crop>(`${this.apiUrl}/${id}`, crop).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("CropService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  deleteCrop(id: number): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error?.message || error.message || "Failed to communicate with server";
        console.error("CropService HTTP error:", error);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
