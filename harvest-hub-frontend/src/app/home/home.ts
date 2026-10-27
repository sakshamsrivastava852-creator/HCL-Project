import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { DashboardService } from "../services/dashboard.service";
import { DashboardStats } from "../models/dashboard.model";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./home.html",
  styleUrl: "./home.css"
})
export class Home implements OnInit {
  userName = "Farm Manager";
  stats: DashboardStats = {
    totalFarms: 0,
    totalFields: 0,
    totalArea: 0,
    totalCrops: 0,
    totalCropPlans: 0,
    activeCropPlans: 0,
    totalOperations: 0,
    ongoingOperations: 0
  };
  isLoading = true;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.name) {
      this.userName = user.name;
    }
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Could not load stats", err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
