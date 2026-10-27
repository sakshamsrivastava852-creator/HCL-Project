import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CropPlanService } from '../services/crop-plan.service';
import { FieldService } from '../services/field.service';
import { CropService } from '../services/crop.service';
import { NotificationService } from '../services/notification.service';
import { CropPlan, PlanStatus } from '../models/crop-plan.model';
import { Field } from '../models/field.model';
import { Crop } from '../models/crop.model';

@Component({
  selector: 'app-crop-plans',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crop-plans.html',
  styleUrl: './crop-plans.css'
})
export class CropPlans implements OnInit {
  cropPlans: CropPlan[] = [];
  fields: Field[] = [];
  crops: Crop[] = [];
  filteredPlans: CropPlan[] = [];
  searchTerm = '';
  selectedStatusFilter = 'ALL';
  isLoading = true;

  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedPlan: CropPlan | null = null;

  planForm!: FormGroup;

  seasons = ['Rabi', 'Kharif', 'Zaid', 'Perennial', 'All-Season'];
  statuses: PlanStatus[] = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  constructor(
    private cropPlanService: CropPlanService,
    private fieldService: FieldService,
    private cropService: CropService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(plan?: CropPlan): void {
    this.planForm = this.fb.group({
      planName: [plan ? plan.planName : '', [Validators.required, Validators.minLength(2)]],
      season: [plan ? plan.season : 'Rabi', [Validators.required]],
      startDate: [plan ? plan.startDate : '', [Validators.required]],
      endDate: [plan ? plan.endDate : '', [Validators.required]],
      status: [plan ? plan.status : 'PLANNED', [Validators.required]],
      fieldId: [plan && plan.field ? plan.field.id : '', [Validators.required]],
      cropId: [plan && plan.crop ? plan.crop.id : '', [Validators.required]]
    });
  }

  loadData(): void {
    console.log('Fetching fields for crop plans...');
    this.isLoading = true;
    this.fieldService.getFields().subscribe({
      next: (fields) => {
        this.fields = fields || [];
        this.loadCropsAndPlans();
      },
      error: (err) => {
        console.error('Error loading fields for plans:', err);
        this.loadCropsAndPlans();
      }
    });
  }

  loadCropsAndPlans(): void {
    console.log('Fetching crops for crop plans...');
    this.cropService.getCrops().subscribe({
      next: (crops) => {
        this.crops = crops || [];
        this.loadPlans();
      },
      error: (err) => {
        console.error('Error loading crops for plans:', err);
        this.loadPlans();
      }
    });
  }

  loadPlans(): void {
    console.log('Fetching crop plans from http://localhost:8080/api/crop-plans...');
    this.cropPlanService.getCropPlans().subscribe({
      next: (data) => {
        console.log('Crop plans fetched successfully:', data);
        this.cropPlans = data || [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching crop plans:', err);
        this.notificationService.error(err.message || 'Failed to load crop plans');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    let result = [...this.cropPlans];

    if (this.selectedStatusFilter !== 'ALL') {
      result = result.filter(p => p.status === this.selectedStatusFilter);
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter(p =>
        p.planName.toLowerCase().includes(term) ||
        p.season.toLowerCase().includes(term) ||
        (p.field && p.field.name.toLowerCase().includes(term)) ||
        (p.crop && p.crop.name.toLowerCase().includes(term))
      );
    }

    this.filteredPlans = result;
  }

  setStatusFilter(status: string): void {
    this.selectedStatusFilter = status;
    this.applyFilter();
    this.cdr.detectChanges();
  }

  cycleStatus(plan: CropPlan, event: Event): void {
    event.stopPropagation();
    if (!plan.id) return;

    const sequence: PlanStatus[] = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    const currentIndex = sequence.indexOf(plan.status);
    const nextStatus = sequence[(currentIndex + 1) % sequence.length];

    this.cropPlanService.updateStatus(plan.id, nextStatus).subscribe({
      next: (updated) => {
        plan.status = updated.status;
        this.applyFilter();
        this.notificationService.success(`Status updated to "${updated.status}"`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to update status');
        this.cdr.detectChanges();
      }
    });
  }

  openAddModal(): void {
    this.initForm();
    if (this.fields.length > 0 && !this.planForm.value.fieldId) {
      this.planForm.patchValue({ fieldId: this.fields[0].id });
    }
    if (this.crops.length > 0 && !this.planForm.value.cropId) {
      this.planForm.patchValue({ cropId: this.crops[0].id });
    }
    this.showAddModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(plan: CropPlan): void {
    this.selectedPlan = plan;
    this.initForm(plan);
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  openDeleteModal(plan: CropPlan): void {
    this.selectedPlan = plan;
    this.showDeleteModal = true;
    this.cdr.detectChanges();
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedPlan = null;
    this.cdr.detectChanges();
  }

  savePlan(): void {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }

    const fieldId = Number(this.planForm.value.fieldId);
    const cropId = Number(this.planForm.value.cropId);
    const selectedField = this.fields.find(f => f.id === fieldId);
    const selectedCrop = this.crops.find(c => c.id === cropId);

    const payload: CropPlan = {
      planName: this.planForm.value.planName.trim(),
      season: this.planForm.value.season,
      startDate: this.planForm.value.startDate,
      endDate: this.planForm.value.endDate,
      status: this.planForm.value.status,
      field: selectedField ? { id: selectedField.id, name: selectedField.name, area: selectedField.area, soilType: selectedField.soilType } : null,
      crop: selectedCrop ? { id: selectedCrop.id, name: selectedCrop.name, season: selectedCrop.season, plantingDate: selectedCrop.plantingDate, expectedYield: selectedCrop.expectedYield } : null
    };

    this.cropPlanService.createCropPlan(payload).subscribe({
      next: (created) => {
        this.cropPlans.unshift(created);
        this.applyFilter();
        this.closeModals();
        this.notificationService.success(`Crop Plan "${created.planName}" created successfully!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to create crop plan');
        this.cdr.detectChanges();
      }
    });
  }

  updatePlan(): void {
    if (!this.selectedPlan || !this.selectedPlan.id || this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }

    const fieldId = Number(this.planForm.value.fieldId);
    const cropId = Number(this.planForm.value.cropId);
    const selectedField = this.fields.find(f => f.id === fieldId);
    const selectedCrop = this.crops.find(c => c.id === cropId);

    const payload: CropPlan = {
      id: this.selectedPlan.id,
      planName: this.planForm.value.planName.trim(),
      season: this.planForm.value.season,
      startDate: this.planForm.value.startDate,
      endDate: this.planForm.value.endDate,
      status: this.planForm.value.status,
      field: selectedField ? { id: selectedField.id, name: selectedField.name, area: selectedField.area, soilType: selectedField.soilType } : null,
      crop: selectedCrop ? { id: selectedCrop.id, name: selectedCrop.name, season: selectedCrop.season, plantingDate: selectedCrop.plantingDate, expectedYield: selectedCrop.expectedYield } : null
    };

    this.cropPlanService.updateCropPlan(this.selectedPlan.id, payload).subscribe({
      next: (updated) => {
        const index = this.cropPlans.findIndex(p => p.id === updated.id);
        if (index !== -1) {
          this.cropPlans[index] = updated;
          this.applyFilter();
        }
        this.closeModals();
        this.notificationService.success(`Crop Plan "${updated.planName}" updated successfully!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to update crop plan');
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(): void {
    if (!this.selectedPlan || !this.selectedPlan.id) return;

    const planId = this.selectedPlan.id;
    const planName = this.selectedPlan.planName;

    this.cropPlanService.deleteCropPlan(planId).subscribe({
      next: () => {
        this.cropPlans = this.cropPlans.filter(p => p.id !== planId);
        this.applyFilter();
        this.closeModals();
        this.notificationService.success(`Crop Plan "${planName}" deleted successfully`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to delete crop plan');
        this.cdr.detectChanges();
      }
    });
  }
}
