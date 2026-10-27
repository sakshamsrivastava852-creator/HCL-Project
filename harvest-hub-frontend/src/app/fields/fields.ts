import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldService } from '../services/field.service';
import { FarmService } from '../services/farm.service';
import { NotificationService } from '../services/notification.service';
import { Field } from '../models/field.model';
import { Farm } from '../models/farm.model';

@Component({
  selector: 'app-fields',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './fields.html',
  styleUrl: './fields.css'
})
export class Fields implements OnInit {
  fields: Field[] = [];
  farms: Farm[] = [];
  filteredFields: Field[] = [];
  searchTerm = '';
  isLoading = true;

  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedField: Field | null = null;

  fieldForm!: FormGroup;

  soilTypes = ['Loamy', 'Clay', 'Sandy', 'Silty', 'Peaty', 'Chalky', 'Black Soil', 'Alluvial'];

  constructor(
    private fieldService: FieldService,
    private farmService: FarmService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(field?: Field): void {
    this.fieldForm = this.fb.group({
      name: [field ? field.name : '', [Validators.required, Validators.minLength(2)]],
      area: [field ? field.area : '', [Validators.required, Validators.min(0.1)]],
      soilType: [field ? field.soilType : 'Loamy', [Validators.required]],
      farmId: [field && field.farm ? field.farm.id : '', [Validators.required]]
    });
  }

  loadData(): void {
    console.log('Fetching farms for fields dropdown...');
    this.isLoading = true;
    this.farmService.getFarms().subscribe({
      next: (farms) => {
        console.log('Farms loaded for fields:', farms);
        this.farms = farms || [];
        this.loadFields();
      },
      error: (err) => {
        console.error('Error loading farms for fields:', err);
        this.loadFields();
      }
    });
  }

  loadFields(): void {
    console.log('Fetching fields from http://localhost:8080/api/fields...');
    this.fieldService.getFields().subscribe({
      next: (data) => {
        console.log('Fields fetched successfully:', data);
        this.fields = data || [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching fields:', err);
        this.notificationService.error(err.message || 'Failed to load fields');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredFields = [...this.fields];
    } else {
      this.filteredFields = this.fields.filter(f =>
        f.name.toLowerCase().includes(term) ||
        f.soilType.toLowerCase().includes(term) ||
        (f.farm && f.farm.name.toLowerCase().includes(term))
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
    if (this.farms.length > 0 && !this.fieldForm.value.farmId) {
      this.fieldForm.patchValue({ farmId: this.farms[0].id });
    }
    this.showAddModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(field: Field): void {
    this.selectedField = field;
    this.initForm(field);
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  openDeleteModal(field: Field): void {
    this.selectedField = field;
    this.showDeleteModal = true;
    this.cdr.detectChanges();
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedField = null;
    this.cdr.detectChanges();
  }

  saveField(): void {
    if (this.fieldForm.invalid) {
      this.fieldForm.markAllAsTouched();
      return;
    }

    const farmId = Number(this.fieldForm.value.farmId);
    const selectedFarm = this.farms.find(f => f.id === farmId);

    const payload: Field = {
      name: this.fieldForm.value.name.trim(),
      area: Number(this.fieldForm.value.area),
      soilType: this.fieldForm.value.soilType,
      farm: selectedFarm ? { id: selectedFarm.id, name: selectedFarm.name, location: selectedFarm.location, totalArea: selectedFarm.totalArea } : null
    };

    this.fieldService.createField(payload).subscribe({
      next: (created) => {
        this.fields.unshift(created);
        this.applyFilter();
        this.closeModals();
        this.notificationService.success(`Field "${created.name}" created successfully!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to create field');
        this.cdr.detectChanges();
      }
    });
  }

  updateField(): void {
    if (!this.selectedField || !this.selectedField.id || this.fieldForm.invalid) {
      this.fieldForm.markAllAsTouched();
      return;
    }

    const farmId = Number(this.fieldForm.value.farmId);
    const selectedFarm = this.farms.find(f => f.id === farmId);

    const payload: Field = {
      id: this.selectedField.id,
      name: this.fieldForm.value.name.trim(),
      area: Number(this.fieldForm.value.area),
      soilType: this.fieldForm.value.soilType,
      farm: selectedFarm ? { id: selectedFarm.id, name: selectedFarm.name, location: selectedFarm.location, totalArea: selectedFarm.totalArea } : null
    };

    this.fieldService.updateField(this.selectedField.id, payload).subscribe({
      next: (updated) => {
        const index = this.fields.findIndex(f => f.id === updated.id);
        if (index !== -1) {
          this.fields[index] = updated;
          this.applyFilter();
        }
        this.closeModals();
        this.notificationService.success(`Field "${updated.name}" updated successfully!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to update field');
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(): void {
    if (!this.selectedField || !this.selectedField.id) return;

    const fieldId = this.selectedField.id;
    const fieldName = this.selectedField.name;

    this.fieldService.deleteField(fieldId).subscribe({
      next: () => {
        this.fields = this.fields.filter(f => f.id !== fieldId);
        this.applyFilter();
        this.closeModals();
        this.notificationService.success(`Field "${fieldName}" deleted successfully`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to delete field');
        this.cdr.detectChanges();
      }
    });
  }
}
