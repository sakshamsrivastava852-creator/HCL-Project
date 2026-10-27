import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CropService } from '../services/crop.service';
import { FieldService } from '../services/field.service';
import { NotificationService } from '../services/notification.service';
import { Crop } from '../models/crop.model';
import { Field } from '../models/field.model';

@Component({
  selector: 'app-crops',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crops.html',
  styleUrl: './crops.css'
})
export class Crops implements OnInit {
  crops: Crop[] = [];
  fields: Field[] = [];
  filteredCrops: Crop[] = [];
  searchTerm = '';
  isLoading = true;

  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedCrop: Crop | null = null;

  cropForm!: FormGroup;

  seasons = ['Rabi', 'Kharif', 'Zaid', 'Perennial', 'Year-Round'];

  constructor(
    private cropService: CropService,
    private fieldService: FieldService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(crop?: Crop): void {
    this.cropForm = this.fb.group({
      name: [crop ? crop.name : '', [Validators.required, Validators.minLength(2)]],
      season: [crop ? crop.season : 'Rabi', [Validators.required]],
      plantingDate: [crop ? crop.plantingDate : '', [Validators.required]],
      expectedYield: [crop ? crop.expectedYield : '', [Validators.required, Validators.min(0)]],
      fieldId: [crop && crop.field ? crop.field.id : '', [Validators.required]]
    });
  }

  loadData(): void {
    console.log('Fetching fields for crops dropdown...');
    this.isLoading = true;
    this.fieldService.getFields().subscribe({
      next: (fields) => {
        console.log('Fields loaded for crops:', fields);
        this.fields = fields || [];
        this.loadCrops();
      },
      error: (err) => {
        console.error('Error loading fields for crops:', err);
        this.loadCrops();
      }
    });
  }

  loadCrops(): void {
    console.log('Fetching crops from http://localhost:8080/api/crops...');
    this.cropService.getCrops().subscribe({
      next: (data) => {
        console.log('Crops fetched successfully:', data);
        this.crops = data || [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching crops:', err);
        this.notificationService.error(err.message || 'Failed to load crops');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredCrops = [...this.crops];
    } else {
      this.filteredCrops = this.crops.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.season.toLowerCase().includes(term) ||
        (c.field && c.field.name.toLowerCase().includes(term))
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
    if (this.fields.length > 0 && !this.cropForm.value.fieldId) {
      this.cropForm.patchValue({ fieldId: this.fields[0].id });
    }
    this.showAddModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(crop: Crop): void {
    this.selectedCrop = crop;
    this.initForm(crop);
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  openDeleteModal(crop: Crop): void {
    this.selectedCrop = crop;
    this.showDeleteModal = true;
    this.cdr.detectChanges();
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedCrop = null;
    this.cdr.detectChanges();
  }

  saveCrop(): void {
    if (this.cropForm.invalid) {
      this.cropForm.markAllAsTouched();
      return;
    }

    const fieldId = Number(this.cropForm.value.fieldId);
    const selectedField = this.fields.find(f => f.id === fieldId);

    const payload: Crop = {
      name: this.cropForm.value.name.trim(),
      season: this.cropForm.value.season,
      plantingDate: this.cropForm.value.plantingDate,
      expectedYield: Number(this.cropForm.value.expectedYield),
      field: selectedField ? { id: selectedField.id, name: selectedField.name, area: selectedField.area, soilType: selectedField.soilType } : null
    };

    this.cropService.createCrop(payload).subscribe({
      next: (created) => {
        this.crops.unshift(created);
        this.applyFilter();
        this.closeModals();
        this.notificationService.success(`Crop "${created.name}" registered successfully!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to create crop');
        this.cdr.detectChanges();
      }
    });
  }

  updateCrop(): void {
    if (!this.selectedCrop || !this.selectedCrop.id || this.cropForm.invalid) {
      this.cropForm.markAllAsTouched();
      return;
    }

    const fieldId = Number(this.cropForm.value.fieldId);
    const selectedField = this.fields.find(f => f.id === fieldId);

    const payload: Crop = {
      id: this.selectedCrop.id,
      name: this.cropForm.value.name.trim(),
      season: this.cropForm.value.season,
      plantingDate: this.cropForm.value.plantingDate,
      expectedYield: Number(this.cropForm.value.expectedYield),
      field: selectedField ? { id: selectedField.id, name: selectedField.name, area: selectedField.area, soilType: selectedField.soilType } : null
    };

    this.cropService.updateCrop(this.selectedCrop.id, payload).subscribe({
      next: (updated) => {
        const index = this.crops.findIndex(c => c.id === updated.id);
        if (index !== -1) {
          this.crops[index] = updated;
          this.applyFilter();
        }
        this.closeModals();
        this.notificationService.success(`Crop "${updated.name}" updated successfully!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to update crop');
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(): void {
    if (!this.selectedCrop || !this.selectedCrop.id) return;

    const cropId = this.selectedCrop.id;
    const cropName = this.selectedCrop.name;

    this.cropService.deleteCrop(cropId).subscribe({
      next: () => {
        this.crops = this.crops.filter(c => c.id !== cropId);
        this.applyFilter();
        this.closeModals();
        this.notificationService.success(`Crop "${cropName}" deleted successfully`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to delete crop');
        this.cdr.detectChanges();
      }
    });
  }
}
