import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FarmService } from '../services/farm.service';
import { NotificationService } from '../services/notification.service';
import { Farm } from '../models/farm.model';

@Component({
  selector: 'app-farms',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './farms.html',
  styleUrl: './farms.css'
})
export class Farms implements OnInit {
  farms: Farm[] = [];
  filteredFarms: Farm[] = [];
  searchTerm = '';
  isLoading = true;

  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedFarm: Farm | null = null;

  farmForm!: FormGroup;

  constructor(
    private farmService: FarmService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadFarms();
  }

  initForm(farm?: Farm): void {
    this.farmForm = this.fb.group({
      name: [farm ? farm.name : '', [Validators.required, Validators.minLength(2)]],
      location: [farm ? farm.location : '', [Validators.required, Validators.minLength(2)]],
      totalArea: [farm ? farm.totalArea : '', [Validators.required, Validators.min(0.1)]]
    });
  }

  loadFarms(): void {
    console.log('Fetching farms from http://localhost:8080/api/farms...');
    this.isLoading = true;
    this.farmService.getFarms().subscribe({
      next: (data) => {
        console.log('Farms fetched successfully:', data);
        this.farms = data || [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching farms:', err);
        this.notificationService.error(err.message || 'Failed to load farms');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredFarms = [...this.farms];
    } else {
      this.filteredFarms = this.farms.filter(f =>
        f.name.toLowerCase().includes(term) ||
        f.location.toLowerCase().includes(term)
      );
    }
  }

  onEmptyStateAction(): void {
    if (this.searchTerm) {
      this.searchTerm = "";
      this.applyFilter();
    } else {
      this.openAddModal();
    }
  }

  openAddModal(): void {
    this.initForm();
    this.showAddModal = true;
  }

  openEditModal(farm: Farm): void {
    this.selectedFarm = farm;
    this.initForm(farm);
    this.showEditModal = true;
  }

  openDeleteModal(farm: Farm): void {
    this.selectedFarm = farm;
    this.showDeleteModal = true;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedFarm = null;
    this.cdr.detectChanges();
  }

  saveFarm(): void {
    if (this.farmForm.invalid) {
      this.farmForm.markAllAsTouched();
      return;
    }

    const payload: Farm = {
      name: this.farmForm.value.name.trim(),
      location: this.farmForm.value.location.trim(),
      totalArea: Number(this.farmForm.value.totalArea)
    };

    this.farmService.createFarm(payload).subscribe({
      next: (created) => {
        this.farms.unshift(created);
        this.applyFilter();
        this.closeModals();
        this.notificationService.success(`Farm "${created.name}" created successfully!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to create farm');
        this.cdr.detectChanges();
      }
    });
  }

  updateFarm(): void {
    if (!this.selectedFarm || !this.selectedFarm.id || this.farmForm.invalid) {
      this.farmForm.markAllAsTouched();
      return;
    }

    const payload: Farm = {
      id: this.selectedFarm.id,
      name: this.farmForm.value.name.trim(),
      location: this.farmForm.value.location.trim(),
      totalArea: Number(this.farmForm.value.totalArea)
    };

    this.farmService.updateFarm(this.selectedFarm.id, payload).subscribe({
      next: (updated) => {
        const index = this.farms.findIndex(f => f.id === updated.id);
        if (index !== -1) {
          this.farms[index] = updated;
          this.applyFilter();
        }
        this.closeModals();
        this.notificationService.success(`Farm "${updated.name}" updated successfully!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to update farm');
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(): void {
    if (!this.selectedFarm || !this.selectedFarm.id) return;

    const farmId = this.selectedFarm.id;
    const farmName = this.selectedFarm.name;

    this.farmService.deleteFarm(farmId).subscribe({
      next: () => {
        this.farms = this.farms.filter(f => f.id !== farmId);
        this.applyFilter();
        this.closeModals();
        this.notificationService.success(`Farm "${farmName}" deleted successfully`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to delete farm');
        this.cdr.detectChanges();
      }
    });
  }
}
